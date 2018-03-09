const { SigReferenceModel } = require('../../model/snort-model/SigReferenceModel');

module.exports = {
    target: SigReferenceModel,
    columns: {
        sig_id: {
            primary: true,
            type: 'int'
        },
        ref_seq: {
            primary: true,
            type: 'int'
        },
        ref_id: {
            type: 'text'
        }
    }
}
