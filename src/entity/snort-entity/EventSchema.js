const { EventModel } = require('../../model/snort-model/EventModel');

module.exports = {
    target: EventModel,
    columns: {
        sid: {
            primary: true,
            type: 'int',
        },
        cid: {
            type: 'int'
        },
        signature: {
            type: 'int'
        },
        timestamp: {
            type: 'datetime'
        }
    }
}
