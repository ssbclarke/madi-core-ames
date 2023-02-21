// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'


// Main data model schema
export const observationsSchema = Type.Object(
  {
    // id: Type.Number(),
    // text: Type.String()
  },
  { $id: 'Observations', additionalProperties: true}
)
export const observationsValidator = getValidator(observationsSchema, dataValidator)




// AROUND - ALL 
export const observationsResolver = resolve({})
export const observationsExternalResolver = resolve({})





// BEFORE - CREATE
// Schema for creating new entries
export const observationsDataSchema = Type.Pick(observationsSchema, ['text'], {
  $id: 'ObservationsData'
})
export const observationsDataValidator = getValidator(observationsDataSchema, dataValidator)
export const observationsDataResolver = resolve({})





// BEFORE - ALL 
// Schema for allowed query properties
export const observationsQueryProperties = Type.Pick(observationsSchema, ['id', 'text'])
export const observationsQuerySchema = Type.Intersect(
  [
    querySyntax(observationsQueryProperties),
    // Add additional query properties here
    Type.Object({
      format:Type.Array()
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const observationsQueryValidator = getValidator(observationsQuerySchema, queryValidator)
export const observationsQueryResolver = resolve({})
