const { RoomModel } = require('../model/RoomModel');

module.exports = {
    target: RoomModel,
    columns: {
        room_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        room: {
            type: 'varchar',
            length: 16
        },
        building_id: {
            type: 'int'
        }
    }
}
