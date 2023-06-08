import * as dotenv from 'dotenv'
import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { Debug } from '../../logger.js'
import { z } from "zod";
import { StructuredTool } from "langchain/tools";
import { ROUTER_PROMPT } from "./analysis.prompt.js"
import { setupRecorder } from "../../utils/nockRecord.js";
import { splitHTMLChain } from './components/splitHTML.chain.js'
import { summarizeDocsChain } from "./components/summarizeDocs.chain.js";
import { urlChain } from './components/url.chain.js'
import { fetchChain } from "./components/fetch.chain.js";
import { summarizeSourceChain } from "./components/summarizeSource.chain.js";
import { parseBoolean } from '../../utils/boolean.js';
const debug = Debug(import.meta.url)
const llm = new OpenAI({ temperature: 0 });
dotenv.config()

/**
 * @typedef {import("../../types.js").Metadata} Metadata 
 * @typedef {import("../../types.js").ServerResponse} ServerResponse
 */



// no url   -> CLARIFY(url) -> WEB-BROWSER(text) -> ANALYSIS(data)
// no text  -> CLARIFY(url)                      -> ANALYSIS(data)
// url                      -> WEB-BROWSER(text) -> ANALYSIS(data)
// text                                          -> ANALYSIS(data)

/**
 * These are the two types of chains for analyzing text
 */
const askUrlAnalysisChain = new SequentialChain({
    chains: [
        urlChain, 
        fetchChain,
        splitHTMLChain,
        summarizeDocsChain,
        summarizeSourceChain
    ],
    inputVariables: ["userinput"],
    // Here we return multiple variables
    outputVariables: [
        "summarizedSourceString"
        // "analysis"
    ],
    verbose:parseBoolean(process.env.VERBOSE) && parseBoolean(process.env.DEBUG)
});

// const askTextAnalysisChain = new SequentialChain({
//     chains: [getAnalysisChain],
//     inputVariables: ["fulltext"],
//     // Here we return multiple variables
//     outputVariables: ["fulltext", "trimtext", "analysis"],
//     verbose: true,
// });

                                      

// @ts-ignore
export class AnalysisTool extends StructuredTool{
    name = "analysis";
    description = "useful for analyzing, summarizing, finding problems, solutions, quotes, and key images from a user-provided source.";

    // pick the right tool
    constructor(options={}){
        super(options)
        this.schema = z.any()
        Object.keys(options).map(k=>{
            this[k] = options.k
        })
        
    }

    /**
     *
     * @param {Array<string,Metadata>} values
     * @returns {Promise<string>}
     */
    async _call(values){
        const record = setupRecorder({mode:process.env.NOCK_MODE});
        const { completeRecording } = await record('analysisRouter');
        debug("analysisTool._call")
        const analysisRouterTemplate = new PromptTemplate({template: ROUTER_PROMPT, inputVariables: ["userinput"]});
        const analysisRouterChain = new LLMChain({llm, prompt: analysisRouterTemplate });
        let routerResult = await analysisRouterChain.call({userinput:values})
        this.returnDirect = true;
        completeRecording()
        let output
        switch(routerResult.text.trim()){
            case 'URL':
                output = (await askUrlAnalysisChain.call({userinput:values}))[askUrlAnalysisChain.outputVariables[0]]
                break;
            case 'TEXT':
                // output = await askTextAnalysisChain.call({userinput:values})
                break;
            default:
                output = routerResult.text.trim()
        }

        // const { completeRecording:cr } = await record('analysisRefiner');
        // this is where you modify the closure metadata object
        // this.metadataUpdate(response, metadata)
     
        // THIS IS WHERE YOU PARSE THE STRUCTURE FOR THE NECESSARY KEYS, THEN PASS AS STRINGIFIED JSON
        return typeof output === 'string' ? output : JSON.stringify(output)
    }
}