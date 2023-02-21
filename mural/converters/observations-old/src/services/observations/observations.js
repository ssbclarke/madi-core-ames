// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  observationsDataValidator,
  // observationsPatchValidator,
  observationsQueryValidator,
  observationsResolver,
  observationsExternalResolver,
  observationsDataResolver,
  // observationsPatchResolver,
  observationsQueryResolver
} from './observations.schema.js'
import { ObservationsService, getOptions } from './observations.class.js'
import { observationsPath, observationsMethods } from './observations.shared.js'

export * from './observations.class.js'
export * from './observations.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const observations = (app) => {
  // Register our service on the Feathers application
  app.use(observationsPath, new ObservationsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: observationsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(observationsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(observationsExternalResolver),
        schemaHooks.resolveResult(observationsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(observationsQueryValidator),
        schemaHooks.resolveQuery(observationsQueryResolver)
      ],
      create: [
        schemaHooks.validateData(observationsDataValidator),
        schemaHooks.resolveData(observationsDataResolver)
      ]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
