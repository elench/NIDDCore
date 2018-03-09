const { SchemaModel } = require('../../model/snort-model/SchemaModel');

module.exports = {
    target: SchemaModel,
    columns: {
        vseq: {
            primary: true,
            type: 'int'
        },
        ctime: {
            type: 'datetime'
        }
    }
}
