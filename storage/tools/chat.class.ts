import { availableToolDescriptions } from './tools/availableTools';
import { callTools } from './tools/callTools';
import openai from "./cacheProxy";

interface Message {
  role: string;
  content: string;
}


export class ChatService {
  async create(data: any, params: any): Promise<Message[]> {

    let messages = data.messages || [];
    const response = await openai.chat.completions.create({
      model: data.model || "gpt-3.5-turbo-1106",
      messages: messages as any,
      tool_choice: data.tool_choice || "auto",
      tools: availableToolDescriptions as any
    });

    return callTools(messages, response);


  }
}

