import assert from 'assert'
import { app } from '../../../src/app'

describe('problems service', () => {
  it('registered the service', () => {
    const service = app.service('problems')

    assert.ok(service, 'Registered the service')
  })
})
