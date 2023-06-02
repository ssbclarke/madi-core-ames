import { redisClient } from "../../redis.js";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { ChainTool, DynamicTool, Tool, StructuredTool } from "langchain/tools";
import * as dotenv from 'dotenv'
import { Document } from "langchain/document";
import { Debug } from '../../logger.js'
import { INVESTIGATION_PROMPT } from "./investigation.prompts.js";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { z } from "zod";
import { CallbackManager } from "langchain/callbacks";

const debug = Debug(import.meta.url)
dotenv.config()

/**
 * @typedef {import("../../types.js").Metadata} Metadata 
 * @typedef {import("../../types.js").ServerResponse} ServerResponse
 */


const createInvestigationStore = async () => {

    // const splitter = new RecursiveCharacterTextSplitter()
    // const splitDocs = await splitter.splitDocuments(docs);
    const embeddings = new OpenAIEmbeddings()

    let investigationVectorStore = new RedisVectorStore(
        embeddings,
        {
            redisClient,
            indexName: "investigations"
        }
    )
    redisClient.on('ready',async ()=>{
        let exists = await investigationVectorStore.checkIndexExists()
        if(!exists){
            // @ts-ignore
            const investigations = await import('../investigations.json', {assert:{type:"json"}})
            let docs = investigations.default.map(({id, description, name})=>{
                return new Document({
                    pageContent: name+"\n"+description.slice(0,2000), 
                    metadata:{name,id}
                })
            })
            investigationVectorStore = await RedisVectorStore.fromDocuments(
                docs,
                embeddings,
                {
                    redisClient,
                    indexName: "investigations",
                }
            )
        }
    })
    return investigationVectorStore
}

export const investigationVectorStore = await createInvestigationStore()

/**
 * Router LLM
 * The result is an object with a `text` property.  
 */
const investigationModel = new OpenAI({ temperature: 0, maxTokens: 150});
const investigationPrompt = PromptTemplate.fromTemplate(INVESTIGATION_PROMPT);

const investigationChain = new LLMChain({ llm: investigationModel, prompt: investigationPrompt });


// @ts-ignore
export class InvestigationTool extends StructuredTool {
    name = "investigation";
    description = "useful for allowing the user to select, specify, or clarify an investigation topic. If the user mentions changing or picking an investigation, this is the right tool.  This will help the user pick and investigation from a list passed in later from memory.";

    constructor(options={}){
        super();
        this.name = options.name || this.name
        this.description = options.description || this.description
        this.returnDirect = true
        this.model = options.model || new OpenAI()

        this.metadata = options.metadata || {}
        this.schema = z.any();
        // z.object({ // metadata
        //     chat_history: z.array(z.any()),
        //     log: z.string(),
        //     message: z.string(),
        //     metadata: z.object({
        //         context: z.object({}),
        //         flowkey: z.string().optional(),
        //         clientMemory: z.string().array().optional(),
        //         memId: z.string().optional()
        //     }),
        //     tool: z.string(),
        //     toolInput: z.string()
        // })
    }

    async call(arg, callbacks) {
        const parsed = await this.schema.parseAsync(arg);
        const callbackManager_ = await CallbackManager.configure(callbacks, this.callbacks, { verbose: this.verbose });
        const runManager = await callbackManager_?.handleToolStart({ name: this.name }, typeof parsed === "string" ? parsed : JSON.stringify(parsed));
        let result;
        try {
            result = await this._call(parsed, runManager);
        }
        catch (e) {
            await runManager?.handleToolError(e);
            throw e;
        }
        
        await runManager?.handleToolEnd(result[0]); // this is required for the tuple response
        return result;
    }

    // call(arg, callbacks) {
    //     return super.call(typeof arg === "string" || !arg ? { input: arg } : arg, callbacks);
    // }

    // async call(values, callbacks) {
    //     const arg = values?.toolInput || "" // this is different

    //     const parsed = await this.schema.parseAsync(arg);
    //     const callbackManager_ = await CallbackManager.configure(callbacks, this.callbacks, { verbose: this.verbose });
    //     const runManager = await callbackManager_?.handleToolStart({ name: this.name }, typeof parsed === "string" ? parsed : JSON.stringify(parsed));
    //     let result;
        
    //     try {
    //         result = await this._call(parsed, runManager, ...values); // necessary for THIS additional ...args
    //     }
    //     catch (e) {
    //         await runManager?.handleToolError(e);
    //         throw e;
    //     }
    //     await runManager?.handleToolEnd(result);
    //     return result;
    // }
    async _call({actionInput, chat_history, message, metadata}, callbackManager){
        let response = await investigationChain.call({ input: actionInput }).then(result=>result?.text.trim() || null)
        if(response.toLowerCase() === 'selection'){
            return InvestigationPrompt(actionInput, metadata)
        }
        return [response, metadata]; //only works because of return direct setting.
    }
}

/**
 * Investigation Search
 * The result is an object with a `text` property.  
 */
export const InvestigationPrompt = async (input, metadata)=>{
    debug('in the InvestigationPrompt call')
    const investigations = await redisClient.ft.search('investigations', '*');
    const names = investigations?.documents.map(d=>{
        return (JSON.parse(`${d?.value?.metadata||""}`.split("\\-").join("-"))).name
    })
    return [
        `Which Investigation are you working on?`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
        {
            ...metadata,
            responseType: 'list',
            choices: names,
            // nextFlowKey: 'investigation-selected'
        }
    ]
}

/**
 * 
 * @param {string} input 
 * @param {Metadata} metadata
 * @returns {Promise<ServerResponse>}
 */
export const InvestigationSelection = async (input, metadata)=>{
    return [
        `Great. You've selected: ${input}`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
        {
            ...metadata,
            context:{
                ...metadata.context,
                investigation: input,
            },
            nextFlowKey: null
        }
    ]
}