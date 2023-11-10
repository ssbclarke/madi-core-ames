import { koa } from '@feathersjs/koa'
import { feathers } from '@feathersjs/feathers'
import { app as v1 } from './app.js'
import { rest } from '@feathersjs/koa'

const port = v1.get('port')
const host = v1.get('host')

// const server = koa(feathers())
// server.use('/api/v1', v1)
// server.configure(rest())

// v1.setup()

// server.listen(port).then(() =>
//   console.log('Feathers application started on http://%s:%d', host, port)
// );



v1.listen(port).then(() =>
    console.log('Feathers application started on http://%s:%d', host, port)
);