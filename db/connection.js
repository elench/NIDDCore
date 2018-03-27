module.exports.knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'niddadmin',
        password: 'nidd2018',
        database: 'niddtestdb'
    }
})
