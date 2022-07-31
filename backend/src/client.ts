import { feathers } from '@feathersjs/feathers'
import type {
  ProblemsData,
  ProblemsResult,
  ProblemsQuery,
} from './services/problems/problems.schema'
import type {
  ObservationsData,
  ObservationsResult,
  ObservationsQuery,
} from './services/observations/observations.schema'
import type {
  UsersData,
  UsersResult,
  UsersQuery,
} from './services/users/users.schema'
import type { Service, TransportConnection, Params } from '@feathersjs/feathers'

export interface ServiceTypes {
  'problems': Service<ProblemsData, ProblemsResult, Params<ProblemsQuery>>
  'observations': Service<ObservationsData, ObservationsResult, Params<ObservationsQuery>>
  'users': Service<UsersData, UsersResult, Params<UsersQuery>>
  // A mapping of client side services
}

export const createClient = <Configuration = any>(connection: TransportConnection<ServiceTypes>) => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)

  return client
}
