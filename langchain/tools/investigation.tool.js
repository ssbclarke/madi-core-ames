import { redisClient } from "../redis.js";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { ChainTool, DynamicTool, Tool } from "langchain/tools";
import * as dotenv from 'dotenv'
import { Document } from "langchain/document";
dotenv.config()
/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
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



// export const InvestigationPrompt = new DynamicTool({
//         name: "Investigation",
//         returnDirect: true,
//         description: "Useful for determining which investigation the human is working on.",
        
//         /**
//          * Overrides the function to respond with search results
//          * @param {*} args 
//          * @returns {Promise<ServerResponse>}
//          */
//         func: async (args) => {
//             const investigations = await redisClient.ft.search('investigations', '*');
//             const names = investigations?.documents.map(d=>{
//                 let metadata = JSON.parse(`${d?.value?.metadata||""}`.split("\\-").join("-"))
//                 return metadata.name
//             })
//             return {
//                 output:`Which Investigation are you working on?`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
//                 //    
//                     type: 'list',
//                     choices: names,
//                     nextFlowKey: 'investigation-step'
//                 // }]
//             }
//         },
//         call: async()=>{
//             console.log('in the call')
//         }
//     })

export class InvestigationPrompt extends Tool{

        constructor(){
            super();
            this.name = "Investigation";
            this.returnDirect= true;
            this.description ="Useful for picking an investigation. Not meant for conversation. The input to this tool MUST be the user's input string exactly. The input cannot be blank. Response must strictly follow RESPONSE FORMAT INSTRUCTIONS.";
        }
        async _call(input){
            debug('in the InvestigationPrompt call')
            const investigations = await redisClient.ft.search('investigations', '*');
            const names = investigations?.documents.map(d=>{
                let metadata = JSON.parse(`${d?.value?.metadata||""}`.split("\\-").join("-"))
                return metadata.name
            })
            return [
                `Which Investigation are you working on?`, //\n${names.map((text,i)=>(` ${i+1}. ${text}`)).join("\n")}`
                {
                    type: 'list',
                    choices: names,
                    nextFlowKey: 'investigation-selected'
                }
            ]
        }
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
            investigation: input,
            nextFlowKey: null
        }
    ]
}