export class ChatTool extends Tool {
    name = "chat";
    description = "useful when adding new articles, websites, sources, or uploads to the user's data and investigation. "
    // Input should be the user's most recent question or statement exactly after 'Begin!`. Input should never be blank.";

    constructor(options={}){
        super();
        this.name = options.name || this.name
        this.description = options.description || this.description
        // this.model = options.model || new OpenAI()
        // this.returnDirect = true;
    }

    async _call(input){
        // const chatPrompt = PromptTemplate.fromTemplate('{query}');
        // const chatChain = new LLMChain({ llm: this.model, prompt: chatPrompt });

        try {
            return 'Final Answer: '+input
            // let output = await chatChain.call({query:input})
            // return output.text.trim()
          } catch (error) {
            return "I don't know how to do that.";
         }
    }
}