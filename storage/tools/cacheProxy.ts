import * as dotenv from 'dotenv'
import OpenAI from 'openai'
import fs from 'fs';
import nodeFetch from 'node-fetch';
import crypto from 'crypto';

dotenv.config()

let openai 
const openaiProxy = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: async (url, options): Promise<Response>=>{

    const md5 = crypto.createHash('md5');
    md5.update(url + JSON.stringify(options));
    const cacheKey = `./cache/${md5.digest('hex')}`;

    return fs.promises.readFile(cacheKey, 'utf8')
    .then(data => {
      console.log('Returning cached response', data);
      return JSON.parse(data);
    })
    .catch(async err => {
      const response = await nodeFetch(url, options);
      const response2 = response.clone();
      const responseBody = await response2.json()
      await fs.promises.writeFile(cacheKey, JSON.stringify(responseBody), 'utf8');
      return response
    })

  }
});

const openaiNormal = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

if(process.env.USE_PROXY === 'true'){
  console.log('Cache Enabled')
  openai = openaiProxy
}else{
  console.log('Cache Disabled')
  openai = openaiNormal
}


export default openai