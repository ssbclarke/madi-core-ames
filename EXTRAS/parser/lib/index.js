/* eslint-disable no-unused-vars */

import { _ } from '@feathersjs/commons';
import main from './main.js';
// import { Puppeteer } from 'puppeteer';

export class Service {
  constructor (options = {}) {
    const {
      allowedFields = ['url', 'allowed', 'meta', 'raw', 'text', 'urls'],
      disableHeadless = false
      // headless = Puppeteer
    } = options;

    try {
      // url,
      // allowed: isAllowed,
      // meta,
      // raw,
      // text,
      // urls

      this.allowedFields = allowedFields;
      this.options = options;
      this.throttle = 1;
      // this.headless = headless;
      this.disableHeadless = disableHeadless;
    } catch (e) {
      throw new Error('Could not start scrapign service', e);
      // errorHandler(e);
    }
    this.validateConfig();
  }

  validateConfig () {
    // const { schema, table, password, username, harperHost } = this.config;
    // if (!harperHost) {
    //   errorHandler(NO_HOST);
    // }
    // if (!schema) {
    //   errorHandler(NO_SCHEMA);
    // }
    // if (!table) {
    //   errorHandler(NO_TABLE);
    // }
    // if (!password || !username) {
    //   errorHandler(NO_AUTH);
    // }
  }

  async create (params) {
    this.validateConfig();

    const { filters } = this.filterQuery(params);

    // only allow selected fields in the
    if (filters.$select) {
    //   data = data.map(entry => {
    //     return filters.$select.reduce((result, key) => {
    //       result[key] = entry[key];
    //       return result;
    //     }, {});
    //   });
    }
    const url = params.url || null;
    const result = await main(url);
    console.log('result');
    return result;
  }

  async setup () {
    // this is where we boot up puppeteer
  }
}

const defaultFunc = options => {
  return new Service(options);
};

export const scrapeData = main;

export default defaultFunc;

// module.exports.default =
// module.exports.Service = Service;
// module.exports.scrapeData = main;
