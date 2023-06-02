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
import { ADD_PROMPT } from "./ADD.prompt.js";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { z } from "zod";

const debug = Debug(import.meta.url)
dotenv.config()

/**
 * @typedef {import("../../types.js").Metadata} Metadata 
 * @typedef {import("../../types.js").ServerResponse} ServerResponse
 */



const addModel = new OpenAI({ temperature: 0, maxTokens: 150});
const addPrompt = PromptTemplate.fromTemplate(ADD_PROMPT);
const addChain = new LLMChain({ llm: addModel, prompt: addPrompt });


export class addTool extends Tool{
    name = "add";
    description = "useful for adding data, sources, articles, uploads or other information to the user's data repository or to an investigation";

    constructor(options={}){
        super();
        this.name = options.name || this.name
        this.description = options.description || this.description
        this.returnDirect = true
        this.model = options.model || new OpenAI()
        //TODO: the ZodEffects needs to allow for a straight ZodObject
        this.schema = z.tuple([
            z.string(), // message,
            z.object({ // metadata
                context: z.object({}),
                flowkey: z.string().optional(),
                clientMemory: z.string().array().optional(),
                memId: z.string().optional()
            })
        ]);
        // this.metadataUpdate = options.metadataUpdate ? options.metadataUpdate : ()=>{};

    }

    /**
     * 
     * @param {Array<string,Metadata>} tuple
     * @returns {Promise<string>}
     */
    async _call([input, metadata]){
        let response = !!input ? await addChain.call({ input }).then(result=>result?.text.trim() || null) : null

        // this is where you modify the closure metadata object
        // this.metadataUpdate(response, metadata)
 
        // THIS IS WHERE YOU PARSE THE STRUCTURE FOR THE NECESSARY KEYS, THEN PASS AS STRINGIFIED JSON
        return response
    }
}