const typeorm = require('typeorm');
const { CameraModel } = require('../model/CameraModel');
const { JobTitleModel } = require('../model/JobTitleModel');
const { BuildingModel } = require('../model/BuildingModel');
const { RoomModel } = require('../model/RoomModel');
const { WorkstationModel } = require('../model/WorkstationModel');
const { PCUserModel } = require('../model/PCUserModel');
const { Workstation } = require('./Workstation');
const { PCUser } = require('./PCUser');
const { Camera } = require('./Camera');
const { decToIp } = require('./ip-decimal');

const options = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'niddadmin',
    password: 'admin',
    database: 'niddcore',
    synchronize: true,
    logging: false,
    entitySchemas: [
        require('../entity/WorkstationSchema'),
        require('../entity/PCUserSchema'),
        require('../entity/CameraSchema'),
        require('../entity/JobTitleSchema'),
        require('../entity/RoomSchema'),
        require('../entity/BuildingSchema')
    ]
}

typeorm.createConnection(options)
.then(async connection => {
    const stationRepository = connection.getRepository(WorkstationModel);
    const pcuserRepository = connection.getRepository(PCUserModel);
    const cameraRepository = connection.getRepository(CameraModel);
    const jobtitleRepository = connection.getRepository(JobTitleModel)
    const roomRepository = connection.getRepository(RoomModel);
    const buildingRepository = connection.getRepository(BuildingModel);

    const stationTable = await stationRepository.find();
    const cameraTable = await cameraRepository.find();
    const pcuserTable = await pcuserRepository.find();
    const roomTable = await roomRepository.find();
    const buildingTable = await buildingRepository.find();
    const jobtitleTable = await jobtitleRepository.find();

    await connection.close();

    console.log(stationTable);
})
.catch(err => {
    console.log(err);
});
