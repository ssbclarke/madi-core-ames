import { Configuration, OpenAIApi } from "openai";
import { BadRequest } from "@feathersjs/errors";
import { openaiSetup } from './openai.setup.js'


export class OpenaiService {
  constructor(options) {
    this.options = options
  }
  async setup(app, path){openaiSetup(app, this)}
}

export const openaiMethods = [ ]

export const getOptions = (app) => {
  return { app }
}
