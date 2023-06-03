import { SequentialChain, LLMChain, AnalyzeDocumentChain, MapReduceDocumentsChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { scraper } from "./playwright.loader.js";
import { BaseChain } from "langchain/chains";
import * as dotenv from 'dotenv'
import { Debug } from '../../logger.js'
import { z } from "zod";
import { BaseOutputParser } from "langchain/schema/output_parser";
import { StructuredTool } from "langchain/tools";
import { ANALYSIS_PROMPT, URL_PROMPT} from "./analysis.prompt.js"
import { ROUTER_PROMPT } from "../../router/router.prompt.js";
import { loadSummarizationChain } from "langchain/chains";

/***
 * This is customized 
 */

// const getTrimTemplate = new PromptTemplate({template: ANALYSIS_PROMPT, inputVariables: ["fulltext"]});
const model = new OpenAI({ temperature: 0 });
const { combineMapPrompt = DEFAULT_PROMPT, combinePrompt = DEFAULT_PROMPT, returnIntermediateSteps, } = params;
const llmChain = new LLMChain({ prompt: combineMapPrompt, llm, verbose:false });
// Step one
const combineLLMChain = new LLMChain({
    prompt: combinePrompt,
    llm,
    verbose,
});
const combineDocumentChain = new StuffDocumentsChain({
    llmChain: combineLLMChain,
    documentVariableName: "text",
    verbose,
});
const chain = new MapReduceDocumentsChain({
    llmChain,
    combineDocumentChain,
    documentVariableName: "text",
    returnIntermediateSteps,
    verbose,
});
return chain;const getTrimTextChain = new TrimChain({
    combineDocumentsChain,
    inputKey: "fulltext",
    outputKey: "trimtext",
    // prompt: getTrimTemplate,

});