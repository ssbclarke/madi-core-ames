import { OpenaiService, getOptions as openaiOptions, openaiMethods } from './openai.class.js'
import { ModelService, getOptions as modelOptions, modelMethods } from './openai.model.class.js'
import { CompletionService, completionOptions } from './openai.completion.class.js'
import { EditService, editOptions} from './openai.edit.class.js'
import { EmbeddingService, embeddingOptions} from './openai.embedding.class.js'
import { ModerationService, moderationOptions} from './openai.moderation.class.js'
import { FileService, FileContentService, fileOptions} from './openai.file.class.js'
import { FineTuneService, fineTuneOptions, FineTuneCancelService, FineTuneEventsService } from './openai.finetune.class.js'
import { 
  ImageGenService, ImageEditService, ImageVarService, 
  imageGenOptions, imageEditOptions, imageVarOptions
} from './openai.image.class.js'


export const openaiPath = 'openai'
export const baseMethods = ['find', 'get', 'create', 'patch', 'update', 'remove']

export * from './openai.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const openai = (app) => {
  app.use(openaiPath, new OpenaiService(openaiOptions(app)), {methods: [],events: []})
  app.use(openaiPath+'/models', new ModelService(modelOptions(app)), {methods: ['find', 'get', 'remove'], events: []})
  app.use(openaiPath+'/edits', new EditService(editOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/completions', new CompletionService(completionOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/images/generations', new ImageGenService(imageGenOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/images/edits', new ImageEditService(imageEditOptions(app), {methods: ['create'],events: []}))
  app.use(openaiPath+'/images/variation', new ImageVarService(imageVarOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/fine-tunes', new FineTuneService(fineTuneOptions(app)), {methods: ['find', 'get', 'create'],events: []})
  app.use(openaiPath+'/fine-tunes/:id/cancel', new FineTuneCancelService(fineTuneOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/fine-tunes/:id/events', new FineTuneEventsService(fineTuneOptions(app)), {methods: ['find'],events: []})
  app.use(openaiPath+'/embeddings', new EmbeddingService(embeddingOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/moderations', new ModerationService(moderationOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/files', new FileService(fileOptions(app)), {methods: ['create'],events: []})
  app.use(openaiPath+'/files/:id/content', new FileContentService(fileOptions(app)), {methods: ['find'],events: []})

  app.service(openaiPath).hooks({})
  app.service(openaiPath+'/models').hooks({})
  app.service(openaiPath+'/edits').hooks({})
  app.service(openaiPath+'/completions').hooks({})
  app.service(openaiPath+'/images/generations').hooks({})
  app.service(openaiPath+'/images/edits').hooks({})
  app.service(openaiPath+'/images/variation').hooks({})
  app.service(openaiPath+'/fine-tunes').hooks({})
  app.service(openaiPath+'/fine-tunes/:id/cancel').hooks({})
  app.service(openaiPath+'/fine-tunes/:id/events').hooks({})
  app.service(openaiPath+'/embeddings').hooks({})
  app.service(openaiPath+'/moderations').hooks({})
  app.service(openaiPath+'/files').hooks({})
  app.service(openaiPath+'/files/:id/content').hooks({})

}
