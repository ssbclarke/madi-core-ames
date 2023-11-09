
import { observations } from './observations/observations.js'
import { murals } from './murals/murals.js'
import * as pkg from 'feathers-openai'
const { openai } = pkg

export const services = (app) => {

  app.configure(observations)
  // app.configure(openai('openai'))
  // app.configure(murals)

  // app.service(app.get('openaiPath')+'/models').hooks({
  //     before: {
  //       all:[(ctx)=>{
  //         console.log('in the openAi Models hook', app.get('openaiPath'))
  //       }]
  //     },
  // })
}
