
import { Debug } from '../logger.js'
import * as dotenv from 'dotenv'
import { RouterExecutor } from './router.executor.js';
import { InvestigationConfirmation } from '../tools/investigation/investigation.tool.js';
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
 * @returns {Promise<Array<string, Metadata>>}
 */
export const router = async (message, incomingMetadata) => {
  const { flowKey } = incomingMetadata || {}
  incomingMetadata.flowKey = null
  let output = []
  switch(flowKey){
    case 'investigation-confirmation': {
      output = await InvestigationConfirmation(message, incomingMetadata)
      break;
      // return output
    }
    // case 'investigation': {
    //   const { output } = await Investigation(message, incomingMetadata)
    //   return output
    // }
    default: {
      output = await RouterExecutor(message, incomingMetadata)
    }
  }

  if(!Array.isArray(output)) throw new Error("Output is not an array")
  return output
};



