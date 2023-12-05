  import { availableTools } from "./availableTools";
  import openai from "../cacheProxy";
  import * as dotenv from 'dotenv'
  dotenv.config()
  
  
  export async function callTools(messages, response){
    
    const responseMessage = response?.choices[0]?.message;
    
    // update the messages to include the assistants reply
    let newMessages = [responseMessage]

    // if the model DOES want to call tools, do so
    if (responseMessage.tool_calls) {    
        
        // for each toolCall, run the tool
        for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableTools[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = functionToCall(functionArgs);
            
            // update the messages to include the tool calls
            newMessages.push({
                tool_call_id: toolCall.id as any,
                role: "tool",
                name: functionName,
                content: functionResponse,
            }); 
        }
        
        // with the extended conversation and tool responses, get a new response.
        const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [...messages, ...newMessages] as any,
        });
    
        return secondResponse;
    }
    else {
        
        return response
    }
  }
