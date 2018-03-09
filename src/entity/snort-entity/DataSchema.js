const { DataModel } = require('../../model/snort-model/DataModel');

module.exports = {
    target: DataModel,
    columns: {
        sid: {
            primary: true,
            type: 'int',
        },
        cid: {
            primary: true,
            type: 'int',
        },
        data_payload: {
            type: 'text'
        }
    }
}
