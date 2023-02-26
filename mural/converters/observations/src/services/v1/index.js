// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { configurationValidator } from '../../configuration.js'
import { logError } from '../../hooks/log-error.js'
import { postgresql } from '../../postgresql.js'


import { murals } from './murals/murals.js'
import { observations } from './observations/observations.js'
import { openai } from './openai/openai.js'

export const services = (api) => {
  api.configure(murals)
  api.configure(observations)
  api.configure(openai)
}


const api = feathers()

// use configuration for subapp
api.configure(configuration(configurationValidator))
api.configure(postgresql)
api.configure(services)

// Register hooks that run on all service methods
api.hooks({
  around: {
    all: [logError]
  },
  before: {
    all:[]
  },
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
api.hooks({
  setup: [],
  teardown: []
})

export { api }
