import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import lodash from 'lodash'

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')


class LowWithLodash extends Low {
    chain = lodash.chain(this).get('data')
}


/**
 * DATABASE UTILITIES
 */

// fetch local data
export async function readDB() {
    const adapter = new JSONFile(file)
    const defaultData = { observations: new Map(), chunks: new Map() }

    db = new LowWithLodash(adapter, defaultData)
    await db.read()
    // console.log(db.data)
    return db
}
// save the current DB to disk
export async function saveDB() {
    await db.write()
}

