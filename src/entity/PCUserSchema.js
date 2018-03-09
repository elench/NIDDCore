const { PCUserModel } = require('../model/PCUserModel');

module.exports = {
    target: PCUserModel,
    columns: {
        pcuser_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        first_name: {
            type: 'varchar',
            length: 64
        },
        last_name: {
            type: 'varchar',
            length: 64
        },
        user_id: {
            type: 'varchar',
            length: 16
        },
        job_title_id: {
            type: 'int'
        },
        room_id: {
            type: 'int'
        },
        phone: {
            type: 'varchar',
            length: 25
        },
        email: {
            type: 'varchar',
            length: 64
        }
    }
}
