const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'niddadmin',
        password: 'nidd2018',
        database: 'niddtestdb'
    }
});
module.exports.findByUsername = (username, cb) => {
    return knex('user')
        .where('username', username)
        .then(result => {
            console.log('findByUsername:', result);
            if (result[0]) {
                cb(null, result[0]);
            }
            else {
                cb(`User "${username}" not found`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports.findById = (id, cb) => {
    return knex('user')
        .where('id', id)
        .then(result => {
            console.log('findById', result);
            if (result[0]) {
                cb(null, result[0]);
            }
            else {
                cb(`User ${id} not found`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}
