import { users } from './users/users.service.js'

export const services = (app) => {
  app.configure(users)

  // All services will be registered here
}
