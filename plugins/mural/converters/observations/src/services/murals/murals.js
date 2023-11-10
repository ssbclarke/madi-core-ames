// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  muralsDataValidator,
  muralsPatchValidator,
  muralsQueryValidator,
  muralsResolver,
  muralsExternalResolver,
  muralsDataResolver,
  muralsPatchResolver,
  muralsQueryResolver
} from './murals.schema.js'
import { MuralsService, getOptions } from './murals.class.js'

export const muralsPath = 'murals'
export const muralsMethods = ['find', 'get', 'create', 'patch', 'remove', 'convert']

export * from './murals.class.js'
export * from './murals.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const murals = (app, prefix='') => {
  // Register our service on the Feathers application
  app.use(prefix+muralsPath, new MuralsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: muralsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(prefix+muralsPath).hooks({
    around: {
      all: [
        // schemaHooks.resolveExternal(muralsExternalResolver), 
        // schemaHooks.resolveResult(muralsResolver)
      ]
    },
    before: {
      all: [
        // schemaHooks.validateQuery(muralsQueryValidator), schemaHooks.resolveQuery(muralsQueryResolver)
      ],
      find: [
        // async (ctx) => {
          // console.log(ctx)
          // let { query,headers,route,provider } = ctx.arguments[0];
          // console.log(query,headers,route,provider )

        // }
      ],
      get: [],
      create: [
        // (ctx)=>{
        //   console.log(ctx)
        // },
        // schemaHooks.validateData(muralsDataValidator), 
        // schemaHooks.resolveData(muralsDataResolver)
      ],
      patch: [
        // schemaHooks.validateData(muralsPatchValidator), schemaHooks.resolveData(muralsPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
