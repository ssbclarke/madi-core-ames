// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, StringEnum } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const muralsSchema = Type.Object(
  {
    id: Type.Number(),
    url: Type.String({ format: 'uri' }),
    raw: Type.Array(Type.Object({})),
    format: StringEnum(['dogbone']),
    result: Type.Array(Type.Object({}))
  },
  { $id: 'Murals', additionalProperties: false }
)
console.log('MURAL', JSON.stringify(muralsSchema,null,2))
export const muralsValidator = getValidator(muralsSchema, dataValidator)
export const muralsResolver = resolve({})

export const muralsExternalResolver = resolve({})

// Schema for creating new entries
export const muralsDataSchema = Type.Pick(muralsSchema, ['url','raw'], {
  $id: 'MuralsData'
})
export const muralsDataValidator = getValidator(muralsDataSchema, dataValidator)
export const muralsDataResolver = resolve({})

// Schema for updating existing entries
export const muralsPatchSchema = Type.Partial(muralsSchema, {
  $id: 'MuralsPatch'
})
export const muralsPatchValidator = getValidator(muralsPatchSchema, dataValidator)
export const muralsPatchResolver = resolve({})

// Schema for allowed query properties
export const muralsQueryProperties = Type.Pick(muralsSchema, ['id', 'url','format'])
export const muralsQuerySchema = Type.Intersect(
  [
    querySyntax(muralsQueryProperties),
    // Add additional query properties here
    Type.Object({
      outputFormat: StringEnum(['md','markdown','yml','yaml','html'])
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const muralsQueryValidator = getValidator(muralsQuerySchema, queryValidator)
export const muralsQueryResolver = resolve({})
