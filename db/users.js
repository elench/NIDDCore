const knex = require('./connection').knex;

const records = [];

knex('user')
.then(results => {
    for (user of results) {
        records.push(user);
    }
});

module.exports.findByUsername = (username, cb) => {
    for (let i = 0, len = records.length; i < len; ++i) {
        let record = records[i];
        if (record.username === username) {
            return cb(null, record);
        }
    }
    return cb(null, null);
}

module.exports.findById = (id, cb) => {
    const idx = id - 1;
    if (records[idx]) {
        cb(null, records[idx]);
    }
    else {
        cb(`User ${id} not found`);
    }
}

module.exports.getFullName = id => {
    const idx = id - 1;
    if (records[idx]) {
        return records[idx].first_name + ' ' + records[idx].last_name;
    }
    else {
        return 'No name';
    }

}

module.exports.changeUsername = (oldUsername, username, firstName, lastName)=> {
    return knex('user')
    .where('username', oldUsername)
    .update({
        username: username,
        first_name: firstName,
        last_name: lastName
    })
    .then(result => {
        for (let i = 0, len = records.length; i < len; ++i) {
            let record = records[i];
            if (record.username === oldUsername) {
                record.username = username;
                record.first_name = firstName;
                record.last_name = lastName;
                return result;
            }
        }
    })
    .catch(err => {
        return err;
    });
}
module.exports.changePassword = (username, password)=> {
    return knex('user')
    .where('username', username)
    .update({
        password
    })
    .then(result => {
        for (let i = 0, len = records.length; i < len; ++i) {
            let record = records[i];
            if (record.username === username) {
                record.password = password;
                return result;
            }
        }
    })
    .catch(err => {
        return err;
    });
}
