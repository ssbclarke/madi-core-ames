import { HumanInputRun } from "../tools/human.tool.js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import dotenv from 'dotenv'

dotenv.config()

/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 */






export const testChain = async (input) =>{
    const model = new ChatOpenAI({
        temperature: 0.1,
        openAIApiKey: process.env.OPENAI_API_KEY,
    })

    const tools = [
        new HumanInputRun()
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "chat-conversational-react-description",
        verbose: true,
      });

    // const chain = new ConversationChain({llm:model, memory, outputKey:"MYOUTPUT"})

    let { output }  = await executor.call({input})

    console.log(output)


}

testChain("Garbage here and there.")


