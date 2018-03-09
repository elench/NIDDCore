const { EncodingModel } = require('../../model/snort-model/EncodingModel');

module.exports = {
    target: EncodingModel,
    columns: {
        encoding_type: {
            primary: true,
            type: 'tinyint',
        },
        encoding_text: {
            type: 'text'
        }
    }
}
