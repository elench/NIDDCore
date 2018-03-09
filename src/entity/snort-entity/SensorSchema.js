const { SensorModel } = require('../../model/snort-model/SensorModel');

module.exports = {
    target: SensorModel,
    columns: {
        sid: {
            primary: true,
            type: 'int'
        },
        hostname: {
            type: 'text'
        },
        interface: {
            type: 'text'
        },
        filter: {
            type: 'text'
        },
        detail: {
            type: 'tinyint'
        },
        encoding: {
            type: 'tinyint'
        },
        last_cid: {
            type: 'int'
        }
    }
}
