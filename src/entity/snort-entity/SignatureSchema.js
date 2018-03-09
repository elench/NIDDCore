const { SignatureModel } = require('../../model/snort-model/SignatureModel');

module.exports = {
    target: SignatureModel,
    columns: {
        sig_id: {
            primary: true,
            type: 'int',
        },
        sig_name: {
            type: 'varchar',
            length: 255
        },
        sig_class_id: {
            type: 'int'
        },
        sig_priority: {
            type: 'int'
        },
        sig_rev: {
            type: 'int'
        },
        sig_sid: {
            type: 'int'
        },
        sig_gid: {
            type: 'int'
        }
    }
}
