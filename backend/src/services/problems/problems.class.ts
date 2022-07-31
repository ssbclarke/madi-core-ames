import type { Id, NullableId, Params } from '@feathersjs/feathers'
import { resolveAll } from '@feathersjs/schema'

import type { ProblemsData, ProblemsResult, ProblemsQuery } from './problems.schema'
import { problemsResolvers } from './problems.resolver'

export const problemsHooks = {
  around: {
    all: [resolveAll(problemsResolvers)]
  },
  before: {},
  after: {},
  error: {}
}

import type { Application } from '../../declarations'

export interface ProblemsServiceOptions {
  app: Application
}

export interface ProblemsParams extends Params<ProblemsQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ProblemsService {
  constructor(public options: ProblemsServiceOptions) {}

  async find(_params?: ProblemsParams): Promise<ProblemsResult[]> {
    return []
  }

  async get(id: Id, _params?: ProblemsParams): Promise<ProblemsResult> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: ProblemsData, params?: ProblemsParams): Promise<ProblemsResult>
  async create(data: ProblemsData[], params?: ProblemsParams): Promise<ProblemsResult[]>
  async create(
    data: ProblemsData | ProblemsData[],
    params?: ProblemsParams
  ): Promise<ProblemsResult | ProblemsResult[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  async update(id: NullableId, data: ProblemsData, _params?: ProblemsParams): Promise<ProblemsResult> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: ProblemsData, _params?: ProblemsParams): Promise<ProblemsResult> {
    return {
      id: 0,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ProblemsParams): Promise<ProblemsResult> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}
