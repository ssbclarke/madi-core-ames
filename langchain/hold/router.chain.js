import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorDBQAChain } from "langchain/chains";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatConversationalAgent} from "langchain/agents";
import { ClarifyTool } from '../tools/clarify.tool.js'
import { ChatMessageHistory } from "langchain/memory";
import { InvestigationPrompt, InvestigationSelection } from "../tools/investigation/investigation.tool.js";
import { SerpAPI, ChainTool } from "langchain/tools";
import dotenv from 'dotenv'
import { redisClient } from "../redis.js";
import { AIChatMessage } from "langchain/schema";
import { getInputValue } from "langchain/memory";

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ROUTER_PROMPT } from './router.promptsOLD.js';
import { Debug } from '../logger.js'
import { ChatAgent } from "../tools/chat.tool.js";
import { establishMemory } from '../memory/memory.js'

const debug = Debug(import.meta.url)


/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 */



/**
 * Router LLM
 * The result is an object with a `text` property.  
 */
const routerModel = new OpenAI({ temperature: 0 });
const routerPrompt = PromptTemplate.fromTemplate(ROUTER_PROMPT);
const routerChain = new LLMChain({ llm: routerModel, prompt: routerPrompt });



/**
 * FlowPicker
 * This allows the clientside to direct the exact chain to use
 * chains are selected by passing in a FlowKey
 * If no key is provided it uses the flowFinder chain to select a tool or respond directly.
 * @param {string} input 
 * @param {Metadata} metadata
 * @returns {Promise<ServerResponse>}
 */
export const router = async (input, {clientMemory, memId, flowKey}) =>{

    if(!Array.isArray(clientMemory)) throw new Error('Client Memory must remain an array');


    let chat_history = clientMemory.map(m=>m.text).join(" \n ")

    // The result is an object with a `text` property.
    const routerKey = !!input ? await routerChain.call({ input, chat_history }).then(result=>result?.text.trim().toLowerCase() || null) : null
    debug({routerKey})
    if(flowKey){
        switch(flowKey){
            case "hello":
                let output = "Hello! I'm Madi. How can I help you?"
                return [ output,
                    {
                        memId,
                        flowKey:null,
                        responseType: 'open',
                        clientMemory: [...clientMemory, new AIChatMessage(output)]
                    }
                ]
                break;
            case "investigation-selected":
                return InvestigationSelection(input, {clientMemory, memId})
            default:
                return flowFinder(input, {clientMemory, memId})
        }
    }else{
        switch(routerKey){
            case "investigation":
                return InvestigationRouter(input, {clientMemory, memId})
            case "scope":
            
            case "confluence":

            case "chat":
            case "web":
            case "human":
                return ChatAgent(input, {clientMemory, memId})

            
            default:
                return flowFinder(input, {clientMemory, memId})
        }
    }


}






























// /**
//  * flowFinder 
//  * takes a generic input and attempts to find the appropriate tool or flow to start
//  * @param {string} input 
//  * @param {Metadata} metadata
//  * @returns {Promise<ServerResponse>}
//  */
// export const flowFinder = async (input, {serverMemory, memId}) =>{
//     debug("in the flowFinder function")
//     const model = new ChatOpenAI({
//         temperature: 0.1,
//         openAIApiKey: process.env.OPENAI_API_KEY,
//     })

//     // looks up the memory from Redis
//     // const memory = new BufferMemory({
//     //     chatHistory: new RedisChatMessageHistory({
//     //       sessionId: memId,
//     //       sessionTTL: 300,
//     //     }),
//     // });
//     //     ) new BufferMemory({
//     //     chatHistory: new ChatMessageHistory(clientMemory),
//     //     memoryKey:'chat_history',
//     //     returnMessages: true,
//     // })

//     const tools = [
//         // new HumanInputRun({
//         //     chat
//         // }),
//         new SerpAPI(process.env.SERPAPI_API_KEY, {
//             location: "Austin,Texas,United States",
//             hl: "en",
//             gl: "us",
//         }),
//         // new Calculator(),
//         // new ChainTool({
//         //     name: "GeoEngineering",
//         //     description:
//         //         "State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.",
//         //     chain: chain,
//         // }),
//         // new ChainTool({
//         //     name: "GeoEngineering",
//         //     description:
//         //         "State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.",
//         //     chain: chain,
//         // }),
//         // new InvestigationPrompt(),
//         new WebBrowser({ model, 
//             embeddings: new OpenAIEmbeddings()
//          })
//     ];

//     const executor = await initializeAgentExecutorWithOptions(tools, model, {
//         agentType: "chat-conversational-react-description",
//         memory: serverMemory,
//         // verbose: true,
//       });

//     // const chain = new ConversationChain({llm:model, memory, outputKey:"MYOUTPUT"})

//     let { output }  = await executor.call({input})

//     if (Array.isArray(output)){
//         return [output[0], { serverMemory, ...output[1]} ]
//     }else{
//         return [output, { serverMemory }]
//     }


// }




// const loadDB = async () => {

//     let html = db.observations[0].content

//     const $ = cheerio.load(html)
//     const text = $('*').text();
//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000
//     })
//     const metadata = { };
//     const docs = await splitter.createDocuments([text], metadata);

//     const embeddings = new OpenAIEmbeddings()

//     /* Create the vectorstore */
//     return RedisVectorStore.fromDocuments(
//         docs,
//         embeddings,
//         {
//             redisClient: client,
//             indexName: "docs",
//         }
//     )

//     const agent = ConversationalAgent.fromLLMAndTools(
//         chat,
//         tools
//     );

//     // This sets up the Agent executor to run the agent.  
//     const executor = AgentExecutor.fromAgentAndTools({
//         agent, 
//         tools,
//         memory: new BufferMemory({
//             returnMessages: true,
//             memoryKey: "chat_history",
//             inputKey: "input",
//         }),
//         verbose:true
//     })
// }


export const run = async () => {
    process.env.LANGCHAIN_HANDLER = "langchain";

    const chat = new ChatOpenAI({})
    const model = new ChatOpenAI({ temperature: 0 });

    const vectorStore = await loadDB()

    /* Create the chain */
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);

    const tools = [
        new HumanInputRun({
            chat
        }),
        new SerpAPI(process.env.SERPAPI_API_KEY, {
            location: "Austin,Texas,United States",
            hl: "en",
            gl: "us",
        }),
        new Calculator(),
        new ChainTool({
            name: "GeoEngineering",
            description:
                "State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.",
            chain: chain,
        }),
        new ChainTool({
            name: "GeoEngineering",
            description:
                "State of the Union QA - useful for when you need to ask questions about the most recent state of the union address.",
            chain: chain,
        }),
        InvestigationTool,
        new WebBrowser({ model, 
            embeddings: new OpenAIEmbeddings(),
            description: `useful for when you need to find something on or summarize a webpage. input should be a comma separated list of "ONE valid http URL including protocol","what you want to find on the page or empty string for a summary".`
         })
    ];

    /* This gives the agent a name and purpose. */
    // const prompt = StructuredChatAgent.createPrompt(tools, {
    //     prefix: `Your name is MADI and you are an AI working for NASA.  Answer the following questions as best you can. You have access to the following tools:`,
    //     suffix: `Begin! Reminder to always use the exact characters \`Final Answer\` when responding.`,
    // });

    // This creates the core Chain with the new prompts
    // const llmChain = new LLMChain({
    //     // prompt: ChatPromptTemplate.fromPromptMessages([
    //     //     // new SystemMessagePromptTemplate(prompt)
    //     // ]),
    //     prompt,
    //     llm: new ChatOpenAI({})
    // });

    // This sets up the Agent and tells it what tools it can use.
    const agent = ChatConversationalAgent.fromLLMAndTools(
        chat,
        tools
    );

    // This sets up the Agent executor to run the agent.  
    const executor = AgentExecutor.fromAgentAndTools({
        agent, 
        tools,
        memory: new BufferMemory({
            returnMessages: true,
            memoryKey: "chat_history",
            inputKey: "input",
        }),
        verbose:true
    })

    // const executor = await initializeAgentExecutorWithOptions(tools, model, {
    //     agentType: "chat-conversational-react-description",
    //     verbose: true,
    // });
    console.log("Loaded agent.");

    let metadata = {
        investigation: null
    }
    const input0 = "I want to set metadata";
    const result0 = await executor.call({ input: input0, metadata});


    // const responseA = await chat.call([
    //     new AIChatMessage(
    //       "What investigation are you working on? Please enter:"+
    //       "\nA. GeoEngineering"+
    //       "\nB. Health & Wellness"+
    //       "\ZC. Zero-Impact Aviation"
    //     ),
    // ]);

    // const input0 = "A";


    // const result0 = await executor.call({ input: input0 });
  
    console.log(`${result0.output}`);
  



}



