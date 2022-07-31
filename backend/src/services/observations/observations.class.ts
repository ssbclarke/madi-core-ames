import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { resolveAll } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import type { ObservationsData, ObservationsResult, ObservationsQuery } from './observations.schema'
import { observationsResolvers } from './observations.resolver'

export const observationsHooks = {
  around: {
    all: [authenticate('jwt'), resolveAll(observationsResolvers)]
  },
  before: {},
  after: {},
  error: {}
}

export interface ObservationsParams extends KnexAdapterParams<ObservationsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ObservationsService extends KnexService<
  ObservationsResult,
  ObservationsData,
  ObservationsParams
> {}
