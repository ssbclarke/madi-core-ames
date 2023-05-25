import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorDBQAChain } from "langchain/chains";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatConversationalAgent} from "langchain/agents";
import { HumanInputRun } from '../tools/human.tool.js'
import { ChatMessageHistory } from "langchain/memory";
import { InvestigationPrompt, InvestigationSelection } from "../tools/investigation.tool.js";
import { SerpAPI, ChainTool } from "langchain/tools";
import dotenv from 'dotenv'
import { redisClient } from "../redis.js";
import { AIChatMessage } from "langchain/schema";
import { getInputValue } from "langchain/memory";
import { Debug } from '../logger.js'
const debug = Debug(import.meta.url)


/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 */



/**
 * @param {array} memoryArray
 * @returns {object} - This should be a ChatHistory Object
 */
function establishMemory(memoryArray){
    let memory = new BufferMemory({
        chatHistory: new ChatMessageHistory(memoryArray),
        memoryKey:'chat_history',
        returnMessages: true,
        
    })
    memory.saveContext = async function (inputValues, outputValues){
        // this is purposefully done in sequence so they're saved in order
        debug("using the new memory.saveContext")
        await this.chatHistory.addUserMessage(getInputValue(inputValues, this.inputKey));
        let output = getInputValue(outputValues, this.outputKey)
        // this allows for a tuple output attached to the memory
        if(Array.isArray(output) && typeof output[0] === 'string' && typeof output[1] === 'object'){
            let message = new AIChatMessage(output[0])
            message.metadata = output[1]
            this.chatHistory.addMessage(message);
        }else{
            await this.chatHistory.addAIChatMessage(output[0]);

        }
    }
    return memory
}


/**
 * FlowPicker
 * This allows the clientside to direct the exact chain to use
 * chains are selected by passing in a FlowKey
 * If no key is provided it uses the flowFinder chain to select a tool or respond directly.
 * @param {string} input 
 * @param {Metadata} metadata
 * @returns {Promise<ServerResponse>}
 */
export const flowPicker = async (input, {clientMemory, memId, flowKey}) =>{

    switch(flowKey){
        case "hello":
            let output = "Hello! I'm Madi. How can I help you?"
            return [ output,
                {
                    memId,
                    flowKey:null,
                    serverMemory: establishMemory([...clientMemory, new AIChatMessage(output)])
                }
            ]
            break;
        case "investigation-prompt":
            // return InvestigationPrompt()
            // return { output }
        case "investigation-selected":
            return InvestigationSelection(input, {serverMemory: establishMemory(clientMemory), memId})
        default:
            return flowFinder(input, {serverMemory: establishMemory(clientMemory), memId})
    }

}


/**
 * flowFinder 
 * takes a generic input and attempts to find the appropriate tool or flow to start
 * @param {string} input 
 * @param {Metadata} metadata
 * @returns {Promise<ServerResponse>}
 */
export const flowFinder = async (input, {serverMemory, memId}) =>{
    console.log("flowfinder")
    const model = new ChatOpenAI({
        temperature: 0.1,
        openAIApiKey: process.env.OPENAI_API_KEY,
    })

    // looks up the memory from Redis
    // const memory = new BufferMemory({
    //     chatHistory: new RedisChatMessageHistory({
    //       sessionId: memId,
    //       sessionTTL: 300,
    //     }),
    // });



    const tools = [
        new HumanInputRun(),
        new ChainTool({
            name: "GeoEngineering",
            description:
                "State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.",
            chain: chain,
        }),
        new InvestigationPrompt(),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "chat-conversational-react-description",
        memory: serverMemory,
        // verbose: true,
      });

    let { output }  = await executor.call({input})

    if (Array.isArray(output)){
        return [output[0], { serverMemory, ...output[1]} ]
    }else{
        return [output, { serverMemory }]
    }


}
