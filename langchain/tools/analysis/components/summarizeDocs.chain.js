import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as dotenv from 'dotenv'
import { Debug } from '../../../logger.js'
import { setupRecorder } from "../../../utils/nockRecord.js";
import { DocumentStore } from "../../../storage/document.vectorstore.js";
import { DefaultChain } from "./default.chain.js";
import { DOC_ANALYSIS_PROMPT } from "../analysis.prompt.js";

const debug = Debug(import.meta.url)
const llm = new OpenAI({ temperature: 0 });
dotenv.config()
const documentStore = await DocumentStore()

const docSummaryPrompt = new PromptTemplate({template: DOC_ANALYSIS_PROMPT, inputVariables: ["doctext"]});
const docSummaryChain = new LLMChain({
  llm,
  prompt: docSummaryPrompt
});

class SummarizeDocsChain extends DefaultChain{
    
    async _call(input){
        debug('SummarizeDocsChain')
        const record = setupRecorder({mode:process.env.NOCK_MODE});
        const { completeRecording } = await record('summarizeDocsChain');

        let values = JSON.parse(input[this.inputVariables[0]])

        let docs = values.docs
        
        // foreach doc 
        let docsPromise = docs.map(async doc=>{
            // run a summarizer chain
            if(doc?.metadata?.summary){
                return doc
            }

            let { text } = await docSummaryChain.call({doctext: doc.pageContent})

            const regex = new RegExp(/(.*)Quote:(.*)Problem:(.*)Solution:(.*)Actors:(.*)/gms)
            let matches = regex.exec(text);
            if (matches) {
                doc.metadata.summary  = matches[1].trim();
                doc.metadata.quote    = matches[2].trim();
                doc.metadata.problem  = matches[3].trim();
                doc.metadata.solution = matches[4].trim();
                doc.metadata.actors   = matches[5].trim();
            }

            // store the summary in the metadata of each doc.
            doc = await documentStore.patch(doc.id, doc)
            return doc[0]
        })
        docs = await Promise.all(docsPromise)
        
        completeRecording()
        return {
            [this.outputKey]:JSON.stringify({
               ...values,
                docs
            })
        }
    }
}
export const summarizeDocsChain = new SummarizeDocsChain({
    name: 'summarizeDocsChain',
    inputVariables: ["withDocsJson"],
    outputKey: "summarizedDocsJson",
})


