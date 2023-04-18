// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('books-2 service', () => {
  it('registered the service', () => {
    const service = app.service('books-2')

    assert.ok(service, 'Registered the service')
  })
})
