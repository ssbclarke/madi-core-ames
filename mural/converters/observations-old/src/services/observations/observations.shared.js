export const observationsPath = 'observations'

export const observationsMethods = ['find', 'get', 'create', 'patch', 'remove']

export const observationsClient = (client) => {
  const connection = client.get('connection')

  client.use(observationsPath, connection.service(observationsPath), {
    methods: observationsMethods
  })
}
