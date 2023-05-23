import { redisClient } from "./redis.js";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { ChainTool, DynamicTool } from "langchain/tools";
import dotenv from 'dotenv'
import { Document } from "langchain/document";

dotenv.config();

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
    let exists = await investigationVectorStore.checkIndexExists()
    if(!exists){
        const investigations = await import('./investigations.json', {assert:{type:"json"}})
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
    return investigationVectorStore
}



export const InvestigationPrompt = async (options)=>{

    const model = new OpenAI({
        temperature: 0.1,
        openAIApiKey: process.env.OPENAI_API_KEY,
    })

    let investigationVectorStore = await createInvestigationStore()

    const chain = VectorDBQAChain.fromLLM(model, investigationVectorStore);

    return new DynamicTool({
        name: "Investigation",
        returnDirect: true,
        description: "Investigation Picker.  Useful for determining which investigation the human is working on.",
        
        /**
         * Overrides the function to respond with search results
         * @param {*} args 
         * @returns {Promise<ServerResponse>}
         */
        func: async (args) => {
            const investigations = await redisClient.ft.search('investigations', '*');
            const names = investigations?.documents.map(d=>{
                let metadata = JSON.parse((d?.value?.metadata||"").split("\\-").join("-"))
                return metadata.name
            })
            return [
                `Which Investigation are you working on?`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
                {   
                    choices: names,
                    nextFlowKey: 'investigation-step'
                }]
        }
    })

    // return {output: ""}
    
    // return new ChainTool({
    //     name: "Investigation",
    //     description: "Investigation Picker.  Useful for determining which investigation the human is working on.",
    //     chain,
    //     // ...options,
    //     returnDirect: true,
    // })
}



export const InvestigationSelection = async (options)=>{

    return {
        output: `Great. You've selected: ${input}`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
        investigation: input,
        nextFlowKey: null
    }
}