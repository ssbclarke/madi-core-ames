import assert from 'assert';
import nock from 'nock';

import { getMetadata } from '../../lib/getMetadata.js';
import example from '../fixtures/exampleDotCom.js';

describe('getMetadata', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('retrieves values from HTML', async () => {
    const output = await getMetadata('http://example.com', example.html);
    assert.equal(output.title, 'Example Domain');
  });

  it('retrieves from URL', async () => {
    nock.define(example.response);
    const output = await getMetadata('http://example.com/');
    assert.equal(output.title, 'Example Domain');
  });
});
