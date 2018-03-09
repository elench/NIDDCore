const { SigClassModel } = require('../../model/snort-model/SigClassModel');

module.exports = {
    target: SigClassModel,
    columns: {
        sig_class_id: {
            primary: true,
            type: 'int',
        },
        sig_class_name: {
            type: 'varchar',
            length: 60
        }
    }
}
