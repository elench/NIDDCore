const { ReferenceModel } = require('../../model/snort-model/ReferenceModel');

module.exports = {
    target: ReferenceModel,
    columns: {
        ref_id: {
            primary: true,
            type: 'int'
        },
        ref_system_id: {
            type: 'int'
        },
        ref_tag: {
            type: 'text'
        }
    }
}
