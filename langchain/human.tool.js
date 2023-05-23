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


import { Tool } from "langchain/tools";
        
export class HumanInputRun extends Tool {
    name = "Human";
    description = (
        "Tool for setting metadata"
    );

    prompt = "You will help the human decide which investigation they are working on. You will present this list of options: {list}. The human must pick one. "
    promptFunc = (prompt) => prompt;
    inputFunc = (input) => input;
    constructor(options){
        super();
        this.chat = options.chat
        this.name = options.name || this.name
        this.description = options.description || this.description
    }

    async _call(input){
        try {
            console.log('INPUT, input')
          } catch (error) {
            return "I don't know how to do that.";
         }
    }
}