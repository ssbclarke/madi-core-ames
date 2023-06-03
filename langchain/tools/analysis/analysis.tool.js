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
import { ANALYSIS_PROMPT, ROUTER_PROMPT, URL_PROMPT, SUMMARY_PROMPT} from "./analysis.prompt.js"
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEncoding } from '../../node_modules/langchain/dist/util/tiktoken.js'
import { createHash } from 'crypto'
import { addDocs } from "../store/add.js";
// import { DEFAULT_PROMPT from "./stuff_prompts.js";
// import { REFINE_PROMPT } from "./refine_prompts.js";}

const debug = Debug(import.meta.url)
const llm = new OpenAI({ temperature: 0 });
dotenv.config()

/**
 * @typedef {import("../../types.js").Metadata} Metadata 
 * @typedef {import("../../types.js").ServerResponse} ServerResponse
 */



/**
 * This is a Default Chain for custom Chain building without the overhead of required functions in every subclass
 */
class DefaultChain extends BaseChain{
    constructor(fields){
        super(fields);
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.chainName = fields.name ?? this.chainName;
        this.passField = fields.passField ?? this.outputKey;
        this.inputVariables = fields.inputVariables || [];
    }
    get outputKeys() {return [this.outputKey];}
    _chainType(){ return this.chainName}
    get inputKeys() {return this.inputVariables || []}
    _call(values){return Promise.resolve(values)}
}





/**
 * This Chain gets the relevant url out of an input.
 */
class getUrlOutputParser extends BaseOutputParser{
    parse(input){
        return input.trim()
    }
    getFormatInstructions(){
        return ""
    }
}
const getUrlTemplate = new PromptTemplate({template: URL_PROMPT, inputVariables: ["userinput"]});
const getUrlChain = new LLMChain({
  llm,
  prompt: getUrlTemplate,
  outputKey: "url",
  outputParser: new getUrlOutputParser()
});



/**
 * This chain fetches a url and returns a JSON stringified response from article-exctractor library
 */
class FetchChain extends DefaultChain{
    async _call({url}){
        let response = await scraper(url)
        return {[this.outputKey]:JSON.stringify(response)}
    }
}
const getScrapedChain = new FetchChain({ //takes in url and outputs stringified JSON
    name: 'fetchChain',
    inputVariables: ["url"],
    outputKey: "scrapedData"
})




/**
 * This chain parses JSON output from the prior step and returns a singular field
 */
class ParseChain extends DefaultChain{
    _call(values){
        let response = JSON.parse(values[this.inputVariables[0]])
        return Promise.resolve({[this.outputKey]:response[this.passField]})
    }
}
const getMetaValuesChain = new ParseChain({ //takes in stringified JSON and returns a single element
    name: 'parseChain',
    inputVariables: ["scrapedData"],
    passField: "content",
    outputKey: "fulltext"
})



/**
 * This takes the full document, breaks it up into smaller docs and reduces the text until it can be summarized effectively.
 */
// class TrimChain extends DefaultChain{
//     _call(values){
//         let response = JSON.parse(values[this.inputVariables[0]])
//         return Promise.resolve({[this.outputKey]:response[this.passField]})
//     }
// }

export function getIdFromText(text){
    return createHash('sha1').update(text).digest('hex')
}
class TrimChain extends DefaultChain{

    constructor(fields){
        super(fields);
        this.encodingName = fields?.encodingName ?? "cl100k_base";
        this.allowedSpecial = fields?.allowedSpecial ?? [];
        this.disallowedSpecial = fields?.disallowedSpecial ?? "all";
    }
    async _call(values, runManager){

        // this is where we create the custom chain
        const model = new OpenAI({ temperature: 0 });
        const combineDocsChain = loadSummarizationChain(model);

        //split the docs
        let splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
            chunkSize: 4000,
            chunkOverlap: 300,
        })
        let docs = await splitter.createDocuments([values[this.inputVariables[0]]])




        // get token length for each doc
        let tokenizer = await getEncoding(this.encodingName || "cl100k_base");
        docs.forEach(doc => {
            const input_ids = tokenizer.encode(doc.pageContent, this.allowedSpecial || [], this.disallowedSpecial || []);
            doc.metadata.tokens = input_ids.length
            doc.metadata.hash = getIdFromText(doc.pageContent)
        });

        await addDocs(docs)
        

        const PROMPT_TOKENS = tokenizer.encode(SUMMARY_PROMPT, this.allowedSpecial || [], this.disallowedSpecial || []).length
        // let summary_prompt: 
        // store the docs
        // await storeDocs()
        let BUFFER = 50
        let TOTAL_TOKENS = 4000 
        let ANSWER_TOKENS = 500
        // let mergeDocs = docs.reduce((store,doc,i)=>{

        //     let newCount = doc.tokens;

        //     let docsLength = TOTAL_TOKENS - newCount - ANSWER_TOKENS - BUFFER
        // },[])
        
        


        const chain = new AnalyzeDocumentChain({
            combineDocumentsChain: combineDocsChain,
        });
        const res = await chain.call({
            input_document: values.fulltext,
        });

        // if (!(this.inputKey in values)) {
        //     throw new Error(`Document key ${this.inputKey} not found.`);
        //   }
        //   const { [this.inputKey]: doc, ...rest } = values;
        //   const currentDoc = doc;
        //   const currentDocs = await this.textSplitter.createDocuments([currentDoc]);
        //   const newInputs = { input_documents: currentDocs, ...rest };
        //   const result = await this.combineDocumentsChain.call(
        //     newInputs,
        //     runManager?.getChild()
        //   );
        // return result;
        return {[this.outputKey]:res.text}
    }
}
const getTrimTextChain = new TrimChain({ //takes in url and outputs stringified JSON
    name: 'trimTextChain',
    inputVariables: ["fulltext"],
    outputKey: "trimtext",
    encodingName: "cl100k_base"
})




const getAnalysisTemplate = new PromptTemplate({template: ANALYSIS_PROMPT, inputVariables: ["trimtext"]});
const getAnalysisChain = new LLMChain({
  llm,
  prompt: getAnalysisTemplate,
  outputKey: "analysis",
});











/**
 * These are the two types of chains for analyzing text
 */

const askUrlAnalysisChain = new SequentialChain({
    chains: [getUrlChain, getScrapedChain, getMetaValuesChain, getTrimTextChain,
        getAnalysisChain
    ],
    inputVariables: ["userinput"],
    // Here we return multiple variables
    outputVariables: ["url", "fulltext", "trimtext", "scrapedData", "analysis", ],
    verbose: true,
});

// const askTextAnalysisChain = new SequentialChain({
//     chains: [getAnalysisChain],
//     inputVariables: ["fulltext"],
//     // Here we return multiple variables
//     outputVariables: ["fulltext", "trimtext", "analysis"],
//     verbose: true,
// });











// no url   -> CLARIFY(url) -> WEB-BROWSER(text) -> ANALYSIS(data)
// no text  -> CLARIFY(url)                      -> ANALYSIS(data)
// url                      -> WEB-BROWSER(text) -> ANALYSIS(data)
// text                                          -> ANALYSIS(data)

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
        const analysisRouterTemplate = new PromptTemplate({template: ROUTER_PROMPT, inputVariables: ["userinput"]});
        const analysisRouterChain = new LLMChain({llm, prompt: analysisRouterTemplate });
        let routerResult = await analysisRouterChain.call({userinput:values})
        let output
        switch(routerResult.text.trim()){
            case 'URL':
                output = await askUrlAnalysisChain.call({userinput:values})
                break;
            // case 'TEXT':
            //     output = await askTextAnalysisChain.call({userinput:values})
            //     break;
            default:
                output = routerResult.text.trim()
        }


        // this is where you modify the closure metadata object
        // this.metadataUpdate(response, metadata)
     
        // THIS IS WHERE YOU PARSE THE STRUCTURE FOR THE NECESSARY KEYS, THEN PASS AS STRINGIFIED JSON
        return `{ action: "final answer", action_input: "${output}" }`
    }
}











// const hasUrlAnalysisResult = await hasUrlAnalysisChain.call({
//     userinput: "I want to add this article to my data set https://www.reuters.com/markets/us/us-debt-ceiling-deal-face-its-first-test-congress-2023-05-30/"
// });
// let output = {...chainExecutionResult, ...JSON.parse(chainExecutionResult.scrapedData)}




// const hasUrlAnalysisResult = await hasUrlAnalysisChain.call({
//     userinput: "I want to add this article to my data set https://www.reuters.com/markets/us/us-debt-ceiling-deal-face-its-first-test-congress-2023-05-30/"
// });
// let output = {...chainExecutionResult, ...JSON.parse(chainExecutionResult.scrapedData)}


// const hasTextAnalysisResult = await hasTextAnalysisChain.call({
//     userinput: input
// })



// console.log(chainExecutionResult);


// no url -> CLARIFY(url) -> WEB-BROWSER(text) -> ANALYSIS(data)
// url -> WEB-BROWSER(text) -> ANALYSIS(data)
// text -> ANALYSIS(data)
// no text -> CLARIFY(url) -> ANALYSIS(data)
