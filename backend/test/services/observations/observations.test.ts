import assert from 'assert'
import { app } from '../../../src/app'

describe('observations service', () => {
  it('registered the service', () => {
    const service = app.service('observations')

    assert.ok(service, 'Registered the service')
  })
})
