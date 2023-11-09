// import { koa } from '@feathersjs/koa'
// import { feathers } from '@feathersjs/feathers'
import { app as v1 } from './app.js'
// import { rest } from '@feathersjs/koa'
// const port = v1.get('port')
// const host = v1.get('host')
import pkg from '@feathersjs/feathers';
const { feathers, version, SERVICE } = pkg;
// server.use('/api/v1', v1)
// server.configure(rest())

// v1.setup()

// server.listen(port).then(() =>
//   console.log('Feathers application started on http://%s:%d', host, port)
// );
async function main(){
    await v1.setup()
    let services = Object.keys(v1.services)
    console.log(services)
    let output = {}
    services.forEach(path=>{
        let service = v1.service(path)
        ouput[path]= {
            methods:service[SERVICE].methods
        }
    })

    // v1.listen(port)

    // console.log(v1)

}




// v1.listen(port).then(() =>
//     console.log('Feathers application started on http://%s:%d', host, port)
// );

// await main

await main()