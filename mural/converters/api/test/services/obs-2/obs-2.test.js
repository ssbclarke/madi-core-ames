// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('obs-2 service', () => {
  it('registered the service', () => {
    const service = app.service('obs-2')

    assert.ok(service, 'Registered the service')
  })
})
