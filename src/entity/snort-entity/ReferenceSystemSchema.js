const { ReferenceSystemModel } = require('../../model/snort-model/ReferenceSystemModel');

module.exports = {
    target: ReferenceSystemModel,
    columns: {
        ref_system_id: {
            primary: true,
            type: 'int'
        },
        ref_system_name: {
            type: 'varchar',
            length: 20
        }
    }
}
