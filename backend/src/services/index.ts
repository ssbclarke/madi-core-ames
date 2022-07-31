import { problems } from './problems/problems.service'
import { observations } from './observations/observations.service'
import { users } from './users/users.service'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(problems)
  app.configure(observations)
  app.configure(users)
  // All services will be registered here
}
