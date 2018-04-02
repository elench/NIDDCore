require('dotenv').config();
module.exports.knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.NIDD_DB_HOSTNAME,
        user: process.env.NIDD_DB_ADMIN_USER,
        password: process.env.NIDD_DB_USERS_PASSWORD,
        database: process.env.NIDD_DB_NAME
    }
})
