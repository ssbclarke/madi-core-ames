import { murals } from './murals/murals.js'
import { observations } from './observations/observations.js'

export const services = (app) => {
  app.configure(murals)
  app.configure(observations)

  // All services will be registered here
}
