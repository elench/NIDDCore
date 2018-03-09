const { DetailModel } = require('../../model/snort-model/DetailModel');

module.exports = {
    target: DetailModel,
    columns: {
        detail_type: {
            primary: true,
            type: 'tinyint',
        },
        detail_text: {
            type: 'text'
        }
    }
}
