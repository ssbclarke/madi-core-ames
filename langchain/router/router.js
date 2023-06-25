
import { Debug } from '../utils/logger.js'
import * as dotenv from 'dotenv'
import { RouterExecutor } from './router.executor.js';
import { InvestigationRouter } from '../features/investigation/investigation.router.js';
dotenv.config()
const debug = Debug(import.meta.url)

/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 */

/**
 * 
 * @param {string} message 
 * @param {Metadata} incomingMetadata 
 * @returns {Promise<[string, Metadata]>}
 */
export const router = async (message, incomingMetadata={}) => {
  const { routerKey } = incomingMetadata
  let output = []
  // incomingMetadata.routerKey = null

  const routerPrefix = (routerKey||"").split('_')[0]
  switch(routerPrefix){
    case 'investigation': {
      output = await InvestigationRouter(message, incomingMetadata)
      break;
    }
    default: {
      output = await RouterExecutor(message, incomingMetadata)
      
    }
  }


  
  /**
   * ALWAYS RETURNS A TUPLE
   */
  if(Array.isArray(output)){
    return [output[0],Object.assign(incomingMetadata, output[1])]
  }
  if(typeof output === "string"){
    return [output, incomingMetadata]
  }
  if(typeof output === 'object'){
    return [output, incomingMetadata]
  }

  
};



