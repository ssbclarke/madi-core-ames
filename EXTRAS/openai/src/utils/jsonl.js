import {appendFile} from 'fs/promises';

export async function asyncAppendJsonl(jsonObject, filePath) {
  return appendFile(filePath, JSON.stringify(jsonObject) + '\n', { encoding: 'utf-8' })
    .catch(err=>{
        console.error(`Error while appending JSON object: ${err}`);
    })
}

export async function asyncCreateJsonl(jsonArray, filePath) {
    for (const jsonObject of jsonArray) {
        await asyncAppendJsonl(jsonObject, filePath)
    }
}
