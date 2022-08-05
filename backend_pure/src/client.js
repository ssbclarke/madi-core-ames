import { feathers } from '@feathersjs/feathers'

export const createClient = (connection) => {
  const client = feathers()

  client.configure(connection)

  return client
}
