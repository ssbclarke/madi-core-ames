import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as dotenv from 'dotenv'
import { Debug } from '../../../logger.js'
import { BaseOutputParser } from "langchain/schema/output_parser";
import { URL_PROMPT } from "../analysis.prompt.js"
import { setupRecorder } from "../../../utils/nockRecord.js";

const debug = Debug(import.meta.url)
const llm = new OpenAI({ temperature: 0 });
dotenv.config()


/**
 * @typedef {import("../../../types.js").Metadata} Metadata 
 * @typedef {import("../../../types.js").ServerResponse} ServerResponse
 */



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
class UrlChain extends LLMChain{
    
    constructor(fields){
        super(fields);
        this.outputKey = fields.outputKey ?? this.outputKey;
        this.chainName = fields.name ?? this.chainName;
        this.passField = fields.passField ?? this.outputKey;
        this.inputVariables = fields.inputVariables || [];
        this.outputParser = fields.outputParser ?? this.outputParser;
    }
    async _call(values, runManager){
        debug("UrlChain._call")
        const record = setupRecorder({mode:process.env.NOCK_MODE});
        const { completeRecording } = await record('urlChain');
        let response = await super._call(values,runManager)
        completeRecording()
        return response
    }
}
const urlTemplate = new PromptTemplate({template: URL_PROMPT, inputVariables: ["userinput"]});
export const urlChain = new UrlChain({
  llm,
  name: 'UrlChain',
  inputVariables: ["userinput"],
  prompt: urlTemplate,
  outputKey: "url",
  outputParser: new getUrlOutputParser()
});

