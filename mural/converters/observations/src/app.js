// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, Koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import { configurationValidator } from './configuration.js'
import { logError } from './hooks/log-error.js'
import rpc from 'feathers-rpc'
import { postgresql } from './postgresql.js'
import mount from 'koa-mount'
import { services } from './services/index.js'
import { openaiMulter } from 'feathers-openai'
import multer from '@koa/multer'


//instantiate the app
const app = koa(feathers())


// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))
// Set up Koa middleware
app.use(cors())
app.use(serveStatic('./public'))
app.use(mount('/api/v1', serveStatic('./specifications/build')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser({ jsonLimit: '3mb', }))
app.use(multer().any()) //required for openai uploads
app.use(openaiMulter) //require for openai uploads


// add pre-service middleware
app.use(rpc()) //parses RPC verbs

// Configure services and transports
app.configure(rest())

// configure the subapp
const v1 = feathers()
v1.configure(configuration(configurationValidator))
v1.configure(postgresql)
v1.configure(services)
app.use('/api/v1/', v1)

v1.hooks({
  around: {
    all: [logError]
  },
  before: {
    all: [(ctx) => {
      console.log('in the v1')
    }]
  },
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
v1.hooks({
  setup: [],
  teardown: []
})

export { app }
