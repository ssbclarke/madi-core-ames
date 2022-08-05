import knex from 'knex'

export const postgresql = (app) => {
  const config = app.get('postgresql')
  const db = knex(config)

  app.set('postgresqlClient', db)
}
