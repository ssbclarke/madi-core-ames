import { app } from './app.js'
import { logger } from './logger.js'
import { api as v1 } from './services/v1/index.js'

const port = app.get('port')
const host = app.get('host')

// import and apply the subapp 
app.use('/api/v1', v1)

process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise ', p, reason))

let server = app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})

// run setup on the subapp
v1.setup(server)


export default app