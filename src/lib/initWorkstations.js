require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

const { Workstation } = require('./Workstation');
const { PCUser } = require('./PCUser');
const { Camera } = require('./Camera');
const { decToIp } = require('./ip-decimal');
const { NIDDCamera } = require('./NIDDCamera');

function initWorkstations() {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host: process.env.NIDD_DB_HOSTNAME,
            user: process.env.NIDD_DB_ADMIN_USER,
            password: process.env.NIDD_DB_USERS_PASSWORD,
            database: process.env.NIDD_DB_NAME
        }
    });

    return knex('workstation as w')
    .innerJoin('camera as c', 'w.camera_id', '=', 'c.camera_id')
    .innerJoin('pcuser as p', 'w.pcuser_id', '=', 'p.pcuser_id')
    .innerJoin('jobtitle as j', 'p.job_title_id', '=', 'j.job_title_id')
    .innerJoin('room as r', 'p.room_id', '=', 'r.room_id')
    .innerJoin('building as b', 'r.building_id', '=', 'b.building_id')
    .then(async joined => {
        const cameras = {};
        const workstations = {};
        let uri;

        workstations.length = 0;

        for (index in joined) {
            let station = joined[index];

            try {
                const cam = await new NIDDCamera({
                    hostname: station.hostname,
                    username: station.username,
                    password: station.password,
                    port: station.port
                })
                .connect();

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
                        hostname,
                        station.username,
                        station.password,
                        station.port
                    )
                    uri = await cam.get_snapshot_uri();
                }

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
                workstations.length += 1;

            }
            catch (err) {
                console.log(err);
                console.log([
                    `Camera "${station.hostname}"`,
                    `for user "${station.first_name}" not found in network.`
                ].join(' '));
            }
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
        workstations.length += 1;


        return workstations;
    })
    .catch(err => {
        return 'Cannot connect: ' + err;
    })

}

module.exports = {
    initWorkstations
}
