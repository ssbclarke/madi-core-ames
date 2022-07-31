import type { Application } from '../../declarations'

import { ObservationsService, observationsHooks } from './observations.class'

// A configure function that registers the service and its hooks via `app.configure`
export function observations(app: Application) {
  const options = {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'observations'
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use('observations', new ObservationsService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('observations').hooks(observationsHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    observations: ObservationsService
  }
}
