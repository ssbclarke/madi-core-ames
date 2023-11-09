import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import * as dotenv from 'dotenv'
dotenv.config()
import { StructuredOutputParser } from "langchain/output_parsers";
import { parseBoolean } from "./utils/boolean.js";
import { Configuration, OpenAIApi } from 'openai';
import * as proxyCache from './proxycache/proxycache.js'
import { IMAGE_PROMPT } from "./features/scenarios/images/images.prompt.js";


if(parseBoolean(process.env.USE_PROXY)){
    process.env.PROXY_PATH  = `http://localhost:${process.env.PROXY_PORT}/v1`
    proxyCache.initializeProxy()
}else{
    process.env.PROXY_PATH  = 'https://api.openai.com/v1'
}

let scenario = `By 2060, social media use had become almost ubiquitous, particularly among adolescents. It was a culture of comparison and competition, creating a breeding ground for feelings of inadequacy and insecurity. The mental health risks associated with its use were increasingly evident, leading to a rise in depression, anxiety, and stress. In order to address the problem, the United Nations established the World Digital Health Database (WDHD), a centralized digital platform to monitor and regulate social media use. Several countries, including the US, China, and the UK, agreed to implement sweeping regulations on social media use with the help of the WDHD.   In response, large social media companies developed tracking software and algorithms to monitor user behavior and track user data for marketing and advertising purposes. This caused a surge in cyberbullying and further increased the mental health risks associated with social media use. To counter this, researchers and scientists created the PRISM software, an artificial intelligence embedded into social media platforms to monitor user behavior and create more secure and healthy digital spaces. To promote the use of the PRISM software, governments launched the “PRISM Initiative,” a massive international effort to encourage its widespread implementation and to protect users from the negative effects of social media.  Social media companies also developed “safe zones” within their platforms, special areas where users could access filtered content and moderated conversations. However, due to the stigma surrounding mental health risks caused by social media use, these had a limited impact on user engagement, particularly among adolescents. In response, lobbyists proposed legislation to limit the amount of time adolescents could spend in the “safe zones” and to ensure that parents had more control over their children’s social media activity.  By 2060, the mental health risks associated with social media use had become a major concern for individuals and society as a whole. With the help of the WDHD, the PRISM Initiative, and new regulations, these risks were gradually addressed and the mental wellbeing of adolescents became a top priority. Though the journey was long and hard, the world eventually came together and prevailed in creating safer and healthier digital spaces.`


// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  realistic: "description of the realistic image prompt",
  artistic:  "description of the artistic image prompt",
  scifi: "description of the scifi image prompt",
});

const formatInstructions = parser.getFormatInstructions();

const scenarioImagesPrompt = new PromptTemplate({
  template: IMAGE_PROMPT,
  inputVariables: ["scenario"],
//   partialVariables: { format_instructions: formatInstructions },
});



export class ScenarioImagesChain extends LLMChain{
    constructor(fields){
      fields.prompt = scenarioImagesPrompt
    //   fields.outputParser = parser
      super(fields)
      this.llm = new OpenAI(
        { temperature: 0, 
          verbose: parseBoolean(process.env.VERBOSE) && parseBoolean(process.env.DEBUG)},
        { basePath: process.env.PROXY_PATH}
      );
    }
  
}

let chain = new ScenarioImagesChain({})
const {text }= await chain.call({ scenario });


const regex = new RegExp(/(.*)Realistic:(.*)ELEMENT:(.*)Artistic:(.*)ELEMENT:(.*)Scifi:(.*)/gms)
let matches = regex.exec(text);
const realistic  = matches[2].trim();
const artistic   = matches[4].trim();
const scifi      = matches[6].trim();

// Images creation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: process.env.PROXY_PATH
});
const openai = new OpenAIApi(configuration);
const responses = [openai.createImage({
  prompt: realistic + " NO TEXT",
  n: 1,
  size: "256x256"
}),
openai.createImage({
    prompt: artistic + " NO TEXT",
    n: 1,
    size: "256x256"
}),
openai.createImage({
    prompt: scifi + " NO TEXT",
    n: 1,
    size: "256x256"
})]

let images = (await Promise.all(responses)).map(i=>(i.data?.data[0]?.url))
console.log(text)
console.log(images)