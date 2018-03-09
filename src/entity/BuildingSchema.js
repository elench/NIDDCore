const { BuildingModel } = require('../model/BuildingModel');

module.exports = {
    target: BuildingModel,
    columns: {
        building_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        building: {
            type: 'varchar',
            length: 16
        }
    }
}
