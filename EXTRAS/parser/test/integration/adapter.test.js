/* eslint-disable no-unused-vars */

// import adapterTests from '@feathersjs/adapter-tests';
// import errors from '@feathersjs/errors';
import feathers from '@feathersjs/feathers';
import serviceLib from '../../lib/index.js';
import assert from 'assert';

const name = 'books';

const events = ['testing']; // not sure why this is needed
const service = serviceLib({ name, events });

describe('Feathers Scraper - Adapter Tests', async () => {
  const app = feathers();

  app.use(`/${name}`, service);
  app.service(`${name}`).hooks({});

  

  // // Creates the necessary tables if they don't exist already
  // it('service starts', async () => {
  //   let start = app.service(`${name}`);
  //   assert.ok(typeof start === 'object');
  // });

  // it('service errors on get', async () => {
  //   // assert.ok(false);
  //   let output = service.create({});
  //   console.log(output);
  //   // const db = await service.createDB().catch(e => {});
  //   // const table = await service.createTable(`${name}`).catch(e => {});
  // });

  // it('service returns on create', async () => {
  //   assert.ok(false);
  //   const db = await service.createDB().catch(e => {});
  //   const table = await service.createTable(`${name}`).catch(e => {});
  // });
  // // Cleans up any remaining elements
  // after(async () => {

  //   // shutdown service
  // });
  // assert.ok(false);
});
