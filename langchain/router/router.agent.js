import {  LLMSingleActionAgent } from "langchain/agents";
import { setupRecorder } from "../utils/nockRecord.js";


export class RouterActionAgent extends LLMSingleActionAgent{
    constructor(fields){
      super(fields);
      this.useObjectKeys = []
      Object.assign(this,fields);
    }

    // This is customized in order to return both tuples and convert strings to tuples
    prepareForOutput(returnValues, steps){
      // if the tool returns a tuple, options will be a tuple.
      if (typeof returnValues.output === 'string'){
        return { 
          output: [returnValues.output,this.metadata]
        }
      }else{
        return returnValues
      }
    }

    // This is customized in order to allow selective use of the metadata pass, so that only tools that are expecting objects will get them
    // Metadata is passed along in the result, whether or not the tool uses it
    async plan(steps, inputs, callbackManager) {
      let {chat_history, message, metadata} = inputs;

      
      const record = setupRecorder({mode:process.env.NOCK_MODE});
      const { completeRecording } = await record(message);

      // this gets the action step itself as output = {text:"my output"}
      const output = await this.llmChain.call({
          intermediate_steps: steps,
          stop: this.stop,
          ...inputs,
      }, callbackManager);

      completeRecording()

      let original = await this.outputParser.parse(output[this.llmChain.outputKey], callbackManager)
    
      // @ts-ignore  
      let {returnValues, toolInput, tool, log} = original
      
      // sets the metadata for later
      this.metadata = metadata
  
      let useObjectKey = this.useObjectKeys.includes(tool);


      // this is now what gets passed TO the tool
      // @ts-ignore
      if(returnValues){
        return { // leaving action
          ...original,
          ...inputs
        }
      }
      //going INTO to tool
      return{
        log,
        tool,
        toolInput: useObjectKey ? { // replaces this from string to object
            ...inputs, //necessary for this ONE line to add metadataNo
            actionInput: toolInput || ""
          } : toolInput // use the string 
      }
      
      
   }
  }
