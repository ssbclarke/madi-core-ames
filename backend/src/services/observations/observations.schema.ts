import { schema, querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'

// Schema for the basic data model (e.g. creating new entries)
export const observationsDataSchema = schema({
  $id: 'ObservationsData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    text: {
      type: 'string'
    }
  }
} as const)

export type ObservationsData = Infer<typeof observationsDataSchema>

// Schema for making partial updates
export const observationsPatchSchema = schema({
  $id: 'ObservationsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...observationsDataSchema.properties
  }
} as const)

export type ObservationsPatch = Infer<typeof observationsPatchSchema>

// Schema for the data that is being returned
export const observationsResultSchema = schema({
  $id: 'ObservationsResult',
  type: 'object',
  additionalProperties: false,
  required: [...observationsDataSchema.required, 'id'],
  properties: {
    ...observationsDataSchema.properties,
    id: {
      type: 'number'
    }
  }
} as const)

export type ObservationsResult = Infer<typeof observationsResultSchema>

// Schema for allowed query properties
export const observationsQuerySchema = schema({
  $id: 'ObservationsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(observationsResultSchema.properties)
  }
} as const)

export type ObservationsQuery = Infer<typeof observationsQuerySchema>
