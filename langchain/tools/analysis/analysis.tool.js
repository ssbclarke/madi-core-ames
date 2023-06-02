import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { scraper } from "./playwright.loader.js";
import { BaseChain } from "langchain/chains";
import * as dotenv from 'dotenv'
import { Debug } from '../../logger.js'
import { z } from "zod";
import { BaseOutputParser } from "langchain/schema/output_parser";
import { StructuredTool } from "langchain/tools";

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
const getUrlPromptTemplate = `Given the user input below, extract the relevant url.  If there is no url return NO_URL_FOUND.

-----------------
{userinput}

`;
class getUrlOutputParser extends BaseOutputParser{
    parse(input){
        return input.trim()
    }
    getFormatInstructions(){
        throw new Error("Does not implement")
        return ''
    }
}
const getUrlTemplate = new PromptTemplate({template: getUrlPromptTemplate, inputVariables: ["userinput"]});
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
 * This Chain performs text analysis and return information in the right structure
 */
const analysisTemplate = 
`You are an assistant and a large language model named Madi.  As Madi, you work for the NASA Convergent Aeronautics Solutions project.  

You are designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics.  Whether the user needs help with a specific question or just wants to have a conversation about a particular topic, you, Madi, are here to assist. However, above all else, all responses must adhere to the format of RESPONSE FORMAT INSTRUCTIONS.  

You must analyze the following text under SOURCE and respond to the user acccording to the RESPONSE FORMAT INSTRUCTIONS.  Do not make up information.  All information must be derived from the source, whether the source is wrong or not. 

RESPONSE FORMAT INSTRUCTIONS
----------------------------
Use the following format in your response:

Summary: a 3-5 sentence summary of the source
Title: a 3-7 word title or headline that is specific about what is described in the source.
Quote: A key line from the source that best reinforces the takeaway. This can be an attributed quote in the source or a section of the source itself. If it is a quote, it must be attributed correctly.
Problem: the problem identified in the source.  If there is no problem, this can be blank.
Solution: the solution to the problem proposed in the source.  If there is no problem or no solution, this can be blank.
Image: a link to the key image in the source.  If there is no image, assistant should NOT create a link.

SOURCE
----------------------------
{fulltext}

----------------------------
Summary:`;

const getAnalysisTemplate = new PromptTemplate({template: analysisTemplate, inputVariables: ["fulltext"]});
const getAnalysisChain = new LLMChain({
  llm,
  prompt: getAnalysisTemplate,
  outputKey: "analysis",
});






/**
 * These are the two types of chains for analyzing text
 */

const askUrlAnalysisChain = new SequentialChain({
    chains: [getUrlChain, getScrapedChain, getMetaValuesChain, getAnalysisChain],
    inputVariables: ["userinput"],
    // Here we return multiple variables
    outputVariables: ["url", "fulltext", "analysis","scrapedData"],
    verbose: true,
});

const askTextAnalysisChain = new SequentialChain({
    chains: [getAnalysisChain],
    inputVariables: ["fulltext"],
    // Here we return multiple variables
    outputVariables: ["fulltext", "analysis"],
    verbose: true,
});






const routerTemplate = 
`You are an assistant and a large language model named Madi.  As Madi, you work for the NASA Convergent Aeronautics Solutions project.  

You are designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics.  Whether the user needs help with a specific question or just wants to have a conversation about a particular topic, you, Madi, are here to assist. However, above all else, all responses must adhere to the format of RESPONSE FORMAT INSTRUCTIONS.  

You must analyze the following text under SOURCE and respond to the user acccording to the RESPONSE FORMAT INSTRUCTIONS.  Do not make up information.  All information must be derived from the source, whether the source is wrong or not. 

RESPONSE FORMAT INSTRUCTIONS
----------------------------
Your response must be one of two options:

TEXT: Useful for analyzing a full or a large portion of text provided by the user. No url is required in the SOURCE.
URL: Useful for analyzing a source with a url that the user provided.  User must have provided a url in the SOURCE.

If the user has not provided full text or a url for analysis, you should respond with a question for the user asking for the url or for the full text.


EXAMPLES
----------------------------
User: I want to evaluate this article https://www.example.com/here-is-the-article
AI: URL

User: I want to evaluate the following text: House Speaker Kevin McCarthy to lift the $31.4 trillion U.S. debt ceiling and achieve new federal spending cuts passed an important hurdle late on Tuesday, advancing to the full House of Representatives for debate and an expected vote on passage on Wednesday.</p><p>The House Rules Committee voted 7-6 to approve the rules allowing debate by the full chamber. Two committee Republicans, Representatives Chip Roy and Ralph Norman, bucked their leadership by opposing the bill.</p><p>That vote underscored the need for Democrats to help pass the measure in the House, which is controlled by Republicans with a narrow 222-213 majority.</p><p>House passage would send the bill to the Senate. The measure needs congressional approval before June 5, when the Treasury Department could run out of funds to pay its debts for the first time in U.S. history.</p><p>If the Treasury Department cannot cover make all its payments, or if it was forced to prioritize payments, that could trigger economic chaos in the U.S. and global economies.</p><p>Biden and McCarthy have predicted they will get enough votes to pass the 99-page bill into law before the June 5 deadline.</p><p>The non-partisan budget scorekeeper for Congress on Tuesday said the legislation would reduce spending from its current projections by $1.5 trillion over 10 years beginning in 2024.</p><p>The Congressional Budget Office also said the measure, if enacted into law, would reduce interest on the public debt by $188 billion.
AI: TEXT

User: I want to evaluate an article.
AI: I'm happy to help with that.  Can you provide the text or url from the article?

User: I want to summarize some text.
AI: I'm happy to help with that.  Can you provide the text or url from the text?

User: Can you help me understand a news link.
AI: I'm happy to help with that.  Can you provide the text or url from the text?


SOURCE
----------------------------
User: {userinput}
AI:`;






// no url   -> CLARIFY(url) -> WEB-BROWSER(text) -> ANALYSIS(data)
// no text  -> CLARIFY(url)                      -> ANALYSIS(data)
// url                      -> WEB-BROWSER(text) -> ANALYSIS(data)
// text                                          -> ANALYSIS(data)

export class AnalysisTool extends StructuredTool{
    name = "analysis";
    description = "useful for analyzing, summarizing, finding problems, solutions, quotes, and key images from a user-provided source.";

    // pick the right tool
    constructor(options={}){
        super(options)
        this.schema = z.object({})
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
        const analysisRouterTemplate = new PromptTemplate({template: routerTemplate, inputVariables: ["userinput"]});
        const analysisRouterChain = new LLMChain({llm, prompt: analysisRouterTemplate });
        let routerResult = await analysisRouterChain.call({userinput:values})
        let output
        switch(routerResult.text){
            case 'URL':
                output = askUrlAnalysisChain.call({userinput:values})
                break;
            case 'TEXT':
                output = askTextAnalysisChain.call({userinput:values})
                break;
            default:
                output = routerResult.text.trim()
        }

        // this is where you modify the closure metadata object
        // this.metadataUpdate(response, metadata)
     
        // THIS IS WHERE YOU PARSE THE STRUCTURE FOR THE NECESSARY KEYS, THEN PASS AS STRINGIFIED JSON
        return `{ action: "final answer", action_input: "" }`
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
