import { ObservationsService, getOptions } from './observations.class.js'

export const observationsPath = 'observations'
export const observationsMethods = ['create'] //['find', 'get', 'create', 'patch', 'remove']

export * from './observations.class.js'

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
      create: [],
    },
    before: {
      create: [],
    },
    after: {
      create: [],
    },
    error: {
      create: [],
    }
  })
}
