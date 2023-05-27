// """Tool for asking human input."""
// from typing import Callable, Optional
// from pydantic import Field
// from langchain.callbacks.manager import (
//     AsyncCallbackManagerForToolRun,
//     CallbackManagerForToolRun,
// )
// from langchain.tools.base import BaseTool
// def _print_func(text: str) -> None:
//     print("\n")
//     print(text)
// class HumanInputRun(BaseTool):
//     """Tool that adds the capability to ask user for input."""
//     name = "Human"
//     description = (
//         "You can ask a human for guidance when you think you "
//         "got stuck or you are not sure what to do next. "
//         "The input should be a question for the human."
//     )
//     prompt_func: Callable[[str], None] = Field(default_factory=lambda: _print_func)
//     input_func: Callable = Field(default_factory=lambda: input)
//     def _run(
//         self,
//         query: str,
//         run_manager: Optional[CallbackManagerForToolRun] = None,
//     ) -> str:
//         """Use the Human input tool."""
//         self.prompt_func(query)
//         return self.input_func()
//     async def _arun(
//         self,
//         query: str,
//         run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
//     ) -> str:
//         """Use the Human tool asynchronously."""
//         raise NotImplementedError("Human tool does not support async")

//HUMAN: Useful for asking the user when you think you got stuck or you are not sure what to do next.
// USER: "How can I inject investigations into purple reindeer?"
// AI: HUMAN


import { Tool } from "langchain/tools";

export class HumanInputRun extends Tool {
    name = "Human";
    description = "You can ask a human for guidance when you think you got stuck or you are not sure what to do next. You should not ask if you can find this information through a web-browser request.";

    // promptFunc = (prompt) => {console.log('\nASKING: ', prompt, '\n')};
    // inputFunc = (input) => {console.log('in the input function')};
    constructor(options={}){
        super();
        this.name = options.name || this.name
        this.description = options.description || this.description
        this.returnDirect = true
        this.modelName = 'gpt-3.5-turbo-0301'
    }

    async _call(input){
        try {
            return input
          } catch (error) {
            return "I don't know how to do that.";
         }
    }
}