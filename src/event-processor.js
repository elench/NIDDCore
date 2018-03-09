const fs = require('fs');
const req = require('request');
const typeorm = require('typeorm');
const { Workstation } = require('./lib/Workstation');
const { ReportModel } = require('./model/ReportModel');
const { Media } = require('./lib/Media');

process.on('message', event => {

    console.log('|------- processor: received event from main ------|');
    console.log(event);
    console.log('|--------------------------------------------------|');

    const srcStation = new Workstation(
        event.srcStation.user,
        event.srcStation.ip,
        event.srcStation.camera,
        event.srcStation.pCoord,
        event.srcStation.tCoord,
        event.srcStation.zCoord,
        event.srcStation.preset
    );
    const dstStation = new Workstation(
        event.dstStation.user,
        event.dstStation.ip,
        event.dstStation.camera,
        event.dstStation.pCoord,
        event.dstStation.tCoord,
        event.dstStation.zCoord,
        event.dstStation.preset
    );

    let srcMedia = null;
    let dstMedia = null;

    performActionSequence(srcStation)
    .then(async media => {
        console.log('-% media = ', media);
        srcMedia = media;

        media = await performActionSequence(dstStation);
        console.log('-% media = ', media);
        dstMedia = media;

        report = await writeReport();
        console.log('-% report has been saved:', report);

        process.send(0);
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });

    function performActionSequence(station) {
        if (station.user.firstName === 'public') {
            return new Promise((resolve, reject) => {
                resolve(new Media('public', new Date()));
            });
        }

        return station.connectCameraPromise()
        .then(async (niddCam) => {
            console.log('-% Connected to NIDDCamera');

            console.log('-% calling station.gotoLocation()');
            msg = await station.gotoLocation(niddCam);
            console.log(`-% ${msg}`);

            console.log('-% calling station.getSnapshot()');
            msg = await station.getSnapshot(niddCam);
            console.log(`-% ${msg}`);

            msg = await storeSnapshot(msg, niddCam);

            return msg;
        })
        .catch(err => {
            throw Error(err);
        });
    }

    function storeSnapshot(uri, niddCam) {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const timestamp = new Date();
                const path = process.cwd() + '/../snapshots/'
                    + timestamp.toLocaleDateString()
                    + '_'
                    + timestamp.toLocaleTimeString().split(':').join('-')
                    + '.jpg';
                const myMedia = new Media(path, timestamp);

                req.get(uri)
                    .auth(niddCam.username, niddCam.password, false)
                    .pipe(fs.createWriteStream(path).on('finish', () => {
                        resolve(myMedia);
                    }));
            }, 2500);
        });
    }

    function writeReport() {
        return typeorm.createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'niddadmin',
            password: 'admin',
            database: 'niddcore',
            synchronize: true,
            logging: false,
            entitySchemas: [
                require('./entity/ReportSchema')
            ]
        })
        .then(async connection => {
            const report = new ReportModel();
            report.hostname = srcStation.camera.hostname + dstStation.camera.hostname;
            report.signature = event.alert.signature;
            report.timestamp = new Date();
            report.ip_src = srcStation.ip;
            report.ip_dst = dstStation.ip;
            report.src_user_first_name = srcStation.user.firstName;
            report.src_user_last_name = srcStation.user.lastName;
            report.src_job_title = srcStation.user.jobTitle;
            report.src_office_room = srcStation.user.officeRoom;
            report.src_office_building = srcStation.user.officeBuilding;
            report.src_phone_number = srcStation.user.phoneNumber;
            report.src_email = srcStation.user.emailAddres;
            report.src_media_path = srcMedia.path;
            report.src_media_timestamp = srcMedia.timestamp;
            report.dst_user_first_name = dstStation.user.firstName;
            report.dst_user_last_name = dstStation.user.lastName;
            report.dst_job_title = dstStation.user.jobTitle;
            report.dst_office_room = dstStation.user.officeRoom;
            report.dst_office_building = dstStation.user.officeBuilding;
            report.dst_phone_number = dstStation.user.phoneNumber;
            report.dst_email = dstStation.user.emailAddres;
            report.dst_media_path = dstMedia.path;
            report.dst_media_timestamp = dstMedia.timestamp;

            const reportRepository = connection.getRepository(ReportModel);
            //return reportRepository.save(report)
            const saved = await reportRepository.save(report);
            await connection.close();
            return saved;
        })
        .catch(err => {
            console.log('writeReport():', err)
        });
    }
    /*
    performActionSequence(srcStation)
    .then(msg => {
        console.log(`-% ${JSON.stringify(msg)}`);
        srcMedia = msg;

        return performActionSequence(dstStation);
    })
    .then(msg => {
        console.log(`-% ${JSON.stringify(msg)}`);
        dstMedia = msg;

        return writeReport();
    })
    .then((msg) => {
        console.log(`-% report has been saved: ${JSON.stringify(msg)}`);
    })
    .then(() => {
        process.send(0);
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
    function performActionSequence(station) {
        return station.connectCameraPromise()
        .then( ({ msg, niddCam }) => {
            console.log(`-% ${JSON.stringify(msg)}`);

            console.log('-% calling station.gotoLocation()');
            return station.gotoLocation(niddCam);
        })
        .then( ({ msg, niddCam }) => {
            console.log(`-% ${JSON.stringify(msg)}`);

            console.log('-% calling station.getSnapshot()');
            return station.getSnapshot(niddCam);
        })
        .then( ({ msg, niddCam }) => {
            return msg;
        })
        .catch(err => {
            console.log(err);
        });
    }
    */
});

process.on('exit', code => {
    console.log(`%%write-file exited: ${code}%%`);
    console.log();
});
