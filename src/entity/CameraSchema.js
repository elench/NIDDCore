const { CameraModel } = require('../model/CameraModel');

module.exports = {
    target: CameraModel,
    columns: {
        camera_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        hostname: {
            type: 'varchar',
            length: 64
        },
        username: {
            type: 'varchar',
            length: 64
        },
        password: {
            type: 'varchar',
            length: 64
        },
        port: {
            type: 'smallint'
        }
    }
}
