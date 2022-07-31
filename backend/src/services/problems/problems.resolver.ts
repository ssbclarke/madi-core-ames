import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../declarations'

import type { ProblemsData, ProblemsPatch, ProblemsResult, ProblemsQuery } from './problems.schema'
import {
  problemsDataSchema,
  problemsPatchSchema,
  problemsResultSchema,
  problemsQuerySchema
} from './problems.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const problemsDataResolver = resolve<ProblemsData, HookContext>({
  schema: problemsDataSchema,
  validate: 'before',
  properties: {}
})

// Resolver for making partial updates
export const problemsPatchResolver = resolve<ProblemsPatch, HookContext>({
  schema: problemsPatchSchema,
  validate: 'before',
  properties: {}
})

// Resolver for the data that is being returned
export const problemsResultResolver = resolve<ProblemsResult, HookContext>({
  schema: problemsResultSchema,
  validate: false,
  properties: {}
})

// Resolver for query properties
export const problemsQueryResolver = resolve<ProblemsQuery, HookContext>({
  schema: problemsQuerySchema,
  validate: 'before',
  properties: {}
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const problemsResolvers = {
  result: problemsResultResolver,
  data: {
    create: problemsDataResolver,
    update: problemsDataResolver,
    patch: problemsPatchResolver
  },
  query: problemsQueryResolver
}
