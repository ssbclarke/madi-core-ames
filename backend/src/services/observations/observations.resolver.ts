import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../declarations'

import type {
  ObservationsData,
  ObservationsPatch,
  ObservationsResult,
  ObservationsQuery
} from './observations.schema'
import {
  observationsDataSchema,
  observationsPatchSchema,
  observationsResultSchema,
  observationsQuerySchema
} from './observations.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const observationsDataResolver = resolve<ObservationsData, HookContext>({
  schema: observationsDataSchema,
  validate: 'before',
  properties: {}
})

// Resolver for making partial updates
export const observationsPatchResolver = resolve<ObservationsPatch, HookContext>({
  schema: observationsPatchSchema,
  validate: 'before',
  properties: {}
})

// Resolver for the data that is being returned
export const observationsResultResolver = resolve<ObservationsResult, HookContext>({
  schema: observationsResultSchema,
  validate: false,
  properties: {}
})

// Resolver for query properties
export const observationsQueryResolver = resolve<ObservationsQuery, HookContext>({
  schema: observationsQuerySchema,
  validate: 'before',
  properties: {}
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const observationsResolvers = {
  result: observationsResultResolver,
  data: {
    create: observationsDataResolver,
    update: observationsDataResolver,
    patch: observationsPatchResolver
  },
  query: observationsQueryResolver
}
