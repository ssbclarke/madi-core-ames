const Datastore = require('@seald-io/nedb')
const db = new Datastore({ filename: 'data', autoload: true }) // You can await db.autoloadPromise to catch a potential error when autoloading.


export default db;