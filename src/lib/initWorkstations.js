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

function initWorkstations() {
    return typeorm.createConnection(options)
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

        const cameras = {};
        for (let cameraEntity of cameraTable) {
            cameras[cameraEntity.camera_id] = new Camera(
                decToIp(parseInt(cameraEntity.hostname)),
                cameraEntity.username,
                cameraEntity.password,
                cameraEntity.port
            );
        }
        const buildings = {};
        for (let buildingEntity of buildingTable) {
            buildings[buildingEntity.building_id] = buildingEntity.building;

        }
        const rooms = {};
        for (let roomEntity of roomTable) {
            rooms[roomEntity.room_id] = {
                room: roomEntity.room,
                building_id: roomEntity.building_id
            }
        }

        const jobtitles = {};
        for (let jobtitleEntity of jobtitleTable) {
            jobtitles[jobtitleEntity.job_title_id] = jobtitleEntity.job_title;
        }

        const pcusers = {};
        for (let pcuserEntity of pcuserTable) {
            pcusers[pcuserEntity.pcuser_id] = new PCUser(
                pcuserEntity.user_id,
                pcuserEntity.first_name,
                pcuserEntity.last_name,
                jobtitles[pcuserEntity.job_title_id],
                rooms[pcuserEntity.room_id].room,
                buildings[rooms[pcuserEntity.room_id].building_id],
                pcuserEntity.phone,
                pcuserEntity.email
            )
        }

        const workstations = {};
        for (let stationEntity of stationTable) {
            workstations[stationEntity.ip] = new Workstation(
                pcusers[stationEntity.pcuser_id],
                stationEntity.ip,
                cameras[stationEntity.camera_id],
                stationEntity.p_coordinate,
                stationEntity.t_coordinate,
                stationEntity.z_coordinate,
                stationEntity.preset
            );
        }

        workstations['public'] = new Workstation(
            new PCUser(
                'public',
                'public',
                'public',
                'public',
                'public',
                'public',
                'public',
                'public',
            )
            , 0
            , new Camera(
                '0.0.0.0',
                0,
                'public',
                'public'
            )
            , 0, 0, 0, 0
        );
        return workstations;
    })
    .catch(err => {
        return 'Cannot connect:' + err;
    });
}

module.exports = {
    initWorkstations
}
