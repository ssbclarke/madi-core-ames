import { Configuration, OpenAIApi } from "openai";
import { BadRequest, MethodNotAllowed} from "@feathersjs/errors";
import { openaiSetup } from './openai.setup.js'

export class ImageGenService {
  constructor(options) {
    this.options = options
  }
  async create(data, params) {
    return this.client.createImage({
      ...data
    }).then(r=>r.data).catch(e=>{console.log(e); throw new BadRequest})
  }
  async setup(app, path){openaiSetup(app, this)}

}


// TODO Needs Multer
export class ImageVarService {
  constructor(options) {
    this.options = options
  }
  async create(data, params) {
    return this.client.createImageVariation(
      fs.createReadStream("otter.png"),
      2,
      "1024x1024"
    ).then(r=>r.data).catch(e=>{console.log(e); throw new BadRequest})
  }
  async setup(app, path){openaiSetup(app, this)}

}

export class ImageEditService {
  constructor(options) {
    this.options = options
  }
  async create(data, params) {
    return this.client.createImageEdit(
      fs.createReadStream("otter.png"),
      fs.createReadStream("mask.png"),
      "A cute baby sea otter wearing a beret",
      2,
      "1024x1024"
    ).then(r=>r.data).catch(e=>{console.log(e); throw new BadRequest})
  }
  async setup(app, path){openaiSetup(app, this)}

}

export const imageEditOptions = (app) => {
  return { app }
}
export const imageGenOptions = (app) => {
  return { app }
}
export const imageVarOptions = (app) => {
  return { app }
}