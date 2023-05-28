
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { GoogleCustomSearch } from "langchain/tools";
import { PromptTemplate } from "langchain/prompts";
import { ROUTER_PROMPT } from './router.prompt.js';
import { Debug } from '../logger.js'
import { FunctionTool } from "../tools/function.tool.js";
import { WebBrowser } from "langchain/tools/webbrowser";
import {
  LLMSingleActionAgent,
  AgentActionOutputParser,
  AgentExecutor,
} from "langchain/agents";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import {
  BaseStringPromptTemplate,
  renderTemplate,
} from "langchain/prompts";
import { Calculator } from "langchain/tools/calculator";
import * as dotenv from 'dotenv'
import { BufferMemory } from "langchain/memory";
import { establishMemory } from "../memory/memory.js";
import { HumanTool, ChatTool } from "../tools/human.tool.js";
dotenv.config()
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
const routerTools = [
  new HumanTool({
      model: routerModel
  }),
  new ChatTool({
      model: routerModel
  }),
  new Calculator(),
  new GoogleCustomSearch({
    apiKey: process.env.GOOGLE_SEARCH_API_KEY,
    googleCSEId: process.env.GOOGLE_SEARCH_API_ID
  }),
  // new InvestigationTool(),
  new FunctionTool(),
  new WebBrowser({
    // @ts-ignore
    description: `useful for when you need to find something on or summarize a webpage.  ONLY use when user input contains a full url or link. If there is no link, use the human tool to ask for one. input should be a comma separated list of "ONE valid http URL including protocol","what you want to find on the page or empty string for a summary".`,
    model: new OpenAI(),
    embeddings: new OpenAIEmbeddings()
  })
];



// /**
//  * FlowPicker
//  * This allows the clientside to direct the exact chain to use
//  * chains are selected by passing in a FlowKey
//  * If no key is provided it uses the flowFinder chain to select a tool or respond directly.
//  * @param {string} input 
//  * @param {Metadata} metadata
//  * @returns {Promise<ServerResponse>}
//  */
// export const routerAgent = async (input, {clientMemory, memId, flowKey}) =>{

//     const executor = await initializeAgentExecutorWithOptions(tools, model, {
//         agentType: "zero-shot-react-description",
//         verbose: true,
//     });

//     return routerChain.call({ input, 
//         chat_history
//      })
// }



class CustomPromptTemplate extends BaseStringPromptTemplate {


  constructor(args) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType() {
    throw new Error("Not implemented");
  }

  async format(values) {

    let [input, metadata] = values.input;
    let recent_chat_messages = values?.chat_history || [];
    /** Construct the final template */
    const tools = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    const tool_names = this.tools.map((tool) => tool.name).join(", ");

    // INVESTIGATION: GeoEngineering
    // SCOPE: internal

    const promptUnfilled = PromptTemplate.fromTemplate(ROUTER_PROMPT);
    const intermediateSteps = values.intermediate_steps;
    const agent_scratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts +
        [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
      ""
    );
    recent_chat_messages=values?.chat_history.map(m=>{
      let type = m._getType();
      let text = m.text || "";
      return type+": "+text
    }).join("\n")
    let recent_chat_summary='';
    let context = Object.keys(metadata.context).map(k=>k.toUpperCase()+": "+metadata?.context[k]||"").join("\n");
    const prompt = await promptUnfilled.format({
      input,
      tools,
      tool_names,
      recent_chat_summary,
      recent_chat_messages,
      context,
      agent_scratchpad
    })
    return prompt;
  }

  partial(_values) {
    throw new Error("Not implemented");
  }

  serialize() {
    throw new Error("Not implemented");
  }
}

class CustomOutputParser extends AgentActionOutputParser {
  async parse(text) {
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }

    const match = /Action:(.*)\nAction Input:(.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text,
    };
  }

  getFormatInstructions() {
    throw new Error("Not implemented");
  }
}

export const router = async (input, metadata) => {
  const model = new OpenAI({ temperature: 0 });
  const tools = routerTools

  const llmChain = new LLMChain({
    prompt: new CustomPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad", "chat_history","context"],
    }),
    llm: model,
  });

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    stop: ["\nObservation"],
  });
  const executor = new AgentExecutor({
    agent,
    tools,
    memory: establishMemory(metadata.clientMemory),
    verbose:true
  });


  const {output} = await executor.call({ input });
  return [output, metadata]
};

