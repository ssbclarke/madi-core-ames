import * as dotenv from 'dotenv';
dotenv.config()
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { GoogleCustomSearch } from "langchain/tools";
import { FunctionTool } from "../tools/function.tool.js";
import { WebBrowser } from "langchain/tools/webbrowser";
import { OpenAI } from "langchain/llms/openai";
import { Calculator } from "langchain/tools/calculator";
import { ClarifyTool } from "../tools/clarify.tool.js";
import { InvestigationTool } from '../features/investigation/investigation.tool.js'
import { AnalysisTool } from "../features/analysis/analysis.tool.js";
import { ChatTool } from "../tools/chat.tool.js";
import { ScenarioTool } from '../features/scenarios/scenario.tool.js';

const routerModel = new OpenAI({ temperature: 0 },{ basePath: process.env.BASE_PATH});

// always available
export const routerCommonTools = [
    new ClarifyTool({
        model: routerModel
    }),
    new ChatTool({
        model: routerModel,
    }),
    new InvestigationTool(),
    new FunctionTool(),
    new AnalysisTool(),
    ScenarioTool
  ];


// only when investigation is set
export  const routerInvIsSetTools = [
    new Calculator(),
    new GoogleCustomSearch({
      apiKey: process.env.GOOGLE_SEARCH_API_KEY,
      googleCSEId: process.env.GOOGLE_SEARCH_API_ID
    }),
    new WebBrowser({
      // @ts-ignore
      description: `useful for when you need to find something on or summarize a webpage.  ONLY use when user input contains a full url or link. If there is no link, use the human tool to ask for one. input should be a comma separated list of "ONE valid http URL including protocol","what you want to find on the page or empty string for a summary". Final Answer should be acknowledgement of the user's request or a summary of the browswer response.`,
      model: new OpenAI({
        maxTokens: 1000
      },{ basePath: process.env.BASE_PATH}),
      embeddings: new OpenAIEmbeddings()
    })
  ]
  // only when investigation is null
export const routerInvIsNotSetTools = [
  
]
  
  
  
  
  