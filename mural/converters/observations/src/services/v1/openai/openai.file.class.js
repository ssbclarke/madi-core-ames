import { Configuration, OpenAIApi } from "openai";
import { BadRequest, MethodNotAllowed} from "@feathersjs/errors";
import { openaiSetup } from './openai.setup.js'

export class FileService {
  constructor(options) {
    this.options = options
  }

  async create(data, params) {
    return this.client.createFile(
      fs.createReadStream("mydata.jsonl"),
      "fine-tune"
    ).then(r=>r.data).catch(e=>{console.log(e); throw new BadRequest})
  }

  async find(params) {
    return this.client.listFiles().then(r=>r.data).catch(e=>{console.log(e); throw new BadRequest})
  }

  async setup(app, path){openaiSetup(app, this)}

}

export class FileContentService {
  constructor(options) {
    this.options = options
  }

  async find(params) {
    if(!(params.route && params.route.id)) throw new BadRequest()
    return this.client.downloadFile(params.route.id).then(r=>r.data).catch(e=>{console.log(e); throw new BadRequest(e)})
  }

}

export const fileOptions = (app) => {
  return { app }
}
