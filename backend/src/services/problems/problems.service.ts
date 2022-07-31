import type { Application } from '../../declarations'

import { ProblemsService, problemsHooks } from './problems.class'

// A configure function that registers the service and its hooks via `app.configure`
export function problems(app: Application) {
  const options = {
    app
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use('problems', new ProblemsService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('problems').hooks(problemsHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    problems: ProblemsService
  }
}
