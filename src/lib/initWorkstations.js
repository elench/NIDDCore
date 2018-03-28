const { Workstation } = require('./Workstation');
const { PCUser } = require('./PCUser');
const { Camera } = require('./Camera');
const { decToIp } = require('./ip-decimal');
const { NIDDCamera } = require('./NIDDCamera');

require('dotenv').config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.NIDD_DB_HOSTNAME,
        user: process.env.NIDD_DB_ADMIN_USER,
        password: process.env.NIDD_DB_USERS_PASSWORD,
        database: process.env.NIDD_DB_NAME
    }
});

function initWorkstations() {
    return knex('workstation as w')
    .innerJoin('camera as c', 'w.camera_id', '=', 'c.camera_id')
    .innerJoin('pcuser as p', 'w.pcuser_id', '=', 'p.pcuser_id')
    .innerJoin('jobtitle as j', 'p.job_title_id', '=', 'j.job_title_id')
    .innerJoin('room as r', 'p.room_id', '=', 'r.room_id')
    .innerJoin('building as b', 'r.building_id', '=', 'b.building_id')
    .then(async joined => {
        const cameras = {};
        const workstations = {};

        for (index in joined) {
            let station = joined[index];
            let pcuser = new PCUser(
                station.user_id,
                station.first_name,
                station.last_name,
                station.job_title,
                station.room,
                station.building,
                station.phone,
                station.email
            );
            let hostname = station.hostname;
            if (!(hostname in cameras)) {
                cameras[hostname] = new Camera(
                    decToIp(parseInt(hostname)),
                    station.user,
                    station.password,
                    station.port
                )
            }

            const cam = await new NIDDCamera({
                hostname: cameras[hostname].hostname,
                username: cameras[hostname].username,
                password: cameras[hostname].password,
                port: cameras[hostname].port
            });

            const uri = await cam.get_snapshot_uri();

            workstations[station.ip] = new Workstation(
                pcuser,
                station.ip,
                cameras[hostname],
                station.p_coordinate,
                station.t_coordinate,
                station.z_coordinate,
                station.preset,
                uri
            )
        }

        workstations['void'] = new Workstation(
            new PCUser(
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            )
            , 0
            , new Camera(
                '',
                0,
                '',
                ''
            )
            , 0, 0, 0, 0, ''
        );

        return workstations;
    })
    .catch(err => {
        return 'Cannot connect: ' + err;
    })

}

module.exports = {
    initWorkstations
}
