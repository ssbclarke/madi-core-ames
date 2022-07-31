import { schema, querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'

// Schema for the basic data model (e.g. creating new entries)
export const problemsDataSchema = schema({
  $id: 'ProblemsData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    text: {
      type: 'string'
    }
  }
} as const)

export type ProblemsData = Infer<typeof problemsDataSchema>

// Schema for making partial updates
export const problemsPatchSchema = schema({
  $id: 'ProblemsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...problemsDataSchema.properties
  }
} as const)

export type ProblemsPatch = Infer<typeof problemsPatchSchema>

// Schema for the data that is being returned
export const problemsResultSchema = schema({
  $id: 'ProblemsResult',
  type: 'object',
  additionalProperties: false,
  required: [...problemsDataSchema.required, 'id'],
  properties: {
    ...problemsDataSchema.properties,
    id: {
      type: 'number'
    }
  }
} as const)

export type ProblemsResult = Infer<typeof problemsResultSchema>

// Schema for allowed query properties
export const problemsQuerySchema = schema({
  $id: 'ProblemsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(problemsResultSchema.properties)
  }
} as const)

export type ProblemsQuery = Infer<typeof problemsQuerySchema>
