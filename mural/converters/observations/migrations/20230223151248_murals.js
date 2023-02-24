export async function up(knex) {
  await knex.schema.createTable('murals', (table) => {
    table.increments('id').notNullable()
    table.string('url').notNullable()
    table.specificType('raw', 'jsonb[]').notNullable()
    table.enu('format', ['dogbone'])
    table.specificType('raw', 'jsonb[]')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('murals')
}
