import { redisClient } from "../../redis.js";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { ChainTool, DynamicTool, Tool } from "langchain/tools";
import * as dotenv from 'dotenv'
import { Document } from "langchain/document";
import { Debug } from '../../logger.js'
import { INVESTIGATION_PROMPT } from "./investigation.prompts.js";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
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

export const InvestigationRouter = async (input, metadata)=>{
    let response = !!input ? await investigationChain.call({ input }).then(result=>result?.text.trim() || null) : null
    if(response.toLowerCase() === 'selection'){
        return InvestigationPrompt(input, metadata)
    }
    return [response, {...metadata,nextFlowKey: null}]
}

/**
 * Investigation Search
 * The result is an object with a `text` property.  
 */
export const InvestigationPrompt = async (input, {clientMemory, memId, flowKey})=>{
    debug('in the InvestigationPrompt call')
    const investigations = await redisClient.ft.search('investigations', '*');
    const names = investigations?.documents.map(d=>{
    let metadata = JSON.parse(`${d?.value?.metadata||""}`.split("\\-").join("-"))
        return metadata.name
    })
    return [
        `Which Investigation are you working on?`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
        {
            responseType: 'list',
            choices: names,
            nextFlowKey: 'investigation-selected'
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