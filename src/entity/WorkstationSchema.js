const { WorkstationModel } = require('../model/WorkstationModel');

module.exports = {
    target: WorkstationModel,
    columns: {
        workstation_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        ip: {
            type: 'bigint'
        },
        pcuser_id: {
            type: 'int'
        },
        camera_id: {
            type: 'int'
        },
        p_coordinate: {
            type: 'decimal',
            precision: 7,
            scale: 6
        },
        t_coordinate: {
            type: 'decimal',
            precision: 7,
            scale: 6
        },
        z_coordinate: {
            type: 'decimal',
            precision: 7,
            scale: 6
        },
        preset: {
            type: 'int'
        }
    }
}
