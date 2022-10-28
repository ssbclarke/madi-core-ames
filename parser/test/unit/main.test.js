import assert from 'assert';
import nock from 'nock';
import { getMetadata } from '../../lib/getMetadata.js';
import example from '../fixtures/exampleDotCom.js';
import main from '../../lib/main.js';

describe('main', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('retrieves text', async () => {
    assert.ok(false);
    nock.define(example.response);
    const output = await main('http://example.com');
    assert.equal(output.title, 'Example Domain');
  });

  it('retrieves urls', async () => {
    assert.ok(false);
    nock.define(example.response);
    const output = await getMetadata('http://example.com/');
    assert.equal(output.title, 'Example Domain');
  });

  it('retrieves metadata', async () => {
    assert.ok(false);
    nock.define(example.response);
    const output = await getMetadata('http://example.com/');
    assert.equal(output.title, 'Example Domain');
  });

  it('disables options', async () => {
    assert.ok(false);
    nock.define(example.response);
    const output = await getMetadata('http://example.com/');
    assert.equal(output.title, 'Example Domain');
  });

  it('throws on disallowed', async () => {
    assert.ok(false);
    nock.define(example.response);
    const output = await getMetadata('http://example.com/');
    assert.equal(output.title, 'Example Domain');
  });
});
