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
import { Calculator } from 'langchain/tools/calculator'
import { GoogleCustomSearch } from "langchain/tools";
import { establishMemory } from "../memory/memory.js";
const debug = Debug(import.meta.url)


/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 */


const chatModel = new ChatOpenAI({ temperature: 0.2});
const chatTools = [ 
    new Calculator(), 
    new GoogleCustomSearch({
        apiKey:process.env.GOOGLE_SEARCH_API_KEY,
        googleCSEId:process.env.GOOGLE_SEARCH_API_ID
    }),
    new WebBrowser({
        model:chatModel, embeddings: new OpenAIEmbeddings()
    })
];





/**
 * takes a generic input and attempts to find the appropriate tool or flow to start
 * @param {string} input 
 * @param {Metadata} metadata
 * @returns {Promise<ServerResponse>}
 */
export const ChatAgent = async (input, {clientMemory, memId}) =>{
    
    // looks up the memory from Redis
    // const memory = establishMemory(serverMemory)

    let memory = establishMemory(clientMemory)
    const executor = await initializeAgentExecutorWithOptions(chatTools, chatModel, {
        agentType: "chat-conversational-react-description",
        memory,
        verbose: true,
      });

    let { output }  = await executor.call({input})

    if (Array.isArray(output)){
        return [output[0], { clientMemory:memory.chatHistory.getMessages(), ...output[1]} ]
    }else{
        return [output, { clientMemory:memory.chatHistory.getMessages() }]
    }
}
