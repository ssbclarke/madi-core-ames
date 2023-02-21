
import { observations } from './observations/observations.js'

export const services = (app) => {

  app.configure(observations)

  // All services will be registered here
}
