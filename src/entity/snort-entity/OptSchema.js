const { OptModel } = require('../../model/snort-model/OptModel');

module.exports = {
    target: OptModel,
    columns: {
        sid: {
            primary: true,
            type: 'int'
        },
        cid: {
            primary: true,
            type: 'int'
        },
        optid: {
            primary: true,
            type: 'int'
        },
        opt_proto: {
            type: 'tinyint'
        },
        opt_code: {
            type: 'tinyint'
        },
        opt_len: {
            type: 'tinyint'
        },
        opt_data: {
            type: 'text'
        }
    }
}
