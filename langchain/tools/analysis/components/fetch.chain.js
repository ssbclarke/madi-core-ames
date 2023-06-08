import { OpenAI } from "langchain/llms/openai";
import { playwrightScraper } from "./playwright.loader.js";
import * as dotenv from 'dotenv'
import { Debug } from '../../../logger.js'
import { setupRecorder } from "../../../utils/nockRecord.js";
import { DocumentStore } from "../../../storage/document.vectorstore.js";
import { SourceStore } from "../../../storage/source.store.js";
import { Tiktoken } from "js-tiktoken/lite";
import encoding from '../../../storage/cl100k_base.json' assert {type:"json"};
let tokenizer = new Tiktoken(encoding);
import { DefaultChain } from "./default.chain.js";

const debug = Debug(import.meta.url)
const llm = new OpenAI({ temperature: 0 });
dotenv.config()
const enableStorage = true;
const sourceStore = await SourceStore()
const documentStore = await DocumentStore()

/**
 * @typedef {import("../../../types.js").Metadata} Metadata 
 * @typedef {import("../../../types.js").ServerResponse} ServerResponse
 */


/**
 * This chain fetches a url and returns a JSON stringified response from article-exctractor library
 */
class FetchChain extends DefaultChain{
    async _call({url}){
        debug("FetchChain._call")
        const record = setupRecorder({mode:process.env.NOCK_MODE});
        const { completeRecording } = await record('fetchChain');
        let response = await sourceStore.createOrRetrieveCallback({
            url
        }, async (source)=>{
            let scrapeResult = await playwrightScraper(source.url)
            return {
                ...scrapeResult,
                // type: 'web',
                // source: scrapeResult.source,
                // published: scrapeResult.published,
                metadata:{
                    tokens: tokenizer.encode(scrapeResult.content).length,
                    // links: scrapeResult.links,
                    // image: scrapeResult.image,
                    // summary: scrapeResult.summary,
                    // title: scrapeResult.title,
                }
            }
        })
        completeRecording()
        return {
            // ...response[0],
            [this.outputKey]:JSON.stringify(response[0]),
        }
    }
}

export const fetchChain = new FetchChain({ //takes in url and outputs stringified JSON
    name: 'fetchChain',
    inputVariables: ["url"],
    outputKey: "scrapedJson" //can only be one thing?
})

