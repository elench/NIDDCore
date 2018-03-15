const fs = require('fs');
const req = require('request');
const { Workstation } = require('./lib/Workstation');
const { ReportModel } = require('./model/ReportModel');
const { Media } = require('./lib/Media');

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'niddadmin',
        password: 'nidd2018',
        database: 'niddtestdb'
    }
});

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

    const snortAlert = event.snortAlert;

    let srcMedia = null;
    let dstMedia = null;

    if (srcStation.camera.hostname === dstStation.camera.hostname) {
        performActionSequence(srcStation)
        .then(async media => {
            srcMedia = media;
            console.log('-% srcMedia = ', srcMedia);

            media = await performActionSequence(dstStation);
            dstMedia = media;
            console.log('-% dstMedia = ', dstMedia);

            report = await writeReport(snortAlert, srcStation, dstStation,
                srcMedia, dstMedia);
            console.log('-% report has been saved:', report);

            process.send(0);
            process.exit(0);
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        });
    }
    else {
        Promise.all([
            performActionSequence(srcStation),
            performActionSequence(dstStation)
        ])
        .then(async values => {
            console.log('Values:', values);
            srcMedia = values[0];
            dstMedia = values[1];
            console.log('-% srcMedia = ', srcMedia);
            console.log('-% srcMedia = ', dstMedia);

            report = await writeReport(snortAlert, srcStation, dstStation,
                srcMedia, dstMedia);
            console.log('-% report has been saved:', report);

            process.send(0);
            process.exit(0);
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        });
    }

});

process.on('exit', code => {
    console.log(`%%write-file exited: ${code}%%`);
    console.log();
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

        //console.log('-% calling station.getSnapshot()');
        //msg = await station.getSnapshot(niddCam);
        //console.log(`-% ${msg}`);

        const uri =
        `http://${niddCam.hostname}/onvifsnapshot/media_service/snapshot?channel=1&subtype=0`;

        console.log('uri:', uri);
        msg = await storeSnapshot(uri, niddCam);

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

            req.get(uri, { timeout: 30000 })
            .on('response', res => {
                console.log(`${niddCam.hostname} - ${res.statusCode}`);
            })
            .auth(niddCam.username, niddCam.password, true)
            .pipe(fs.createWriteStream(path).on('finish', () => {
                resolve(myMedia);
            }));
        }, 2500);
    });
}

function writeReport(snortAlert, srcStation, dstStation, srcMedia, dstMedia) {
    return knex('niddreport')
    .insert({
        nidd_report_id: null,
        sid: snortAlert.sid,
        cid: snortAlert.cid,
        hostname: snortAlert.hostname,
        interface: snortAlert.interface,
        signature: snortAlert.signature,
        timestamp: snortAlert.timestamp,
        sig_priority: snortAlert.sig_priority,
        sig_gid: snortAlert.sig_gid,
        sig_name: snortAlert.sig_name,
        sig_rev: snortAlert.sig_rev,
        ip_src: snortAlert.ip_src,
        ip_dst: snortAlert.ip_dst,
        ip_ver: snortAlert.ip_ver,
        ip_proto: snortAlert.ip_proto,
        tcp_sport: snortAlert.tcp_sport,
        tcp_dport: snortAlert.tcp_dport,
        udp_sport: snortAlert.udp_sport,
        udp_dport: snortAlert.udp_dport,
        icmp_type: snortAlert.icmp_type,
        icmp_code: snortAlert.icmp_code,
        src_user_first_name: srcStation.user.firstName,
        src_user_last_name: srcStation.user.lastName,
        src_job_title: srcStation.user.jobTitle,
        src_office_room: srcStation.user.officeRoom,
        src_office_building: srcStation.user.officeBuilding,
        src_phone: srcStation.user.phoneNumber,
        src_email: srcStation.user.emailAddress,
        src_media_path: srcMedia.path,
        src_media_timestamp: srcMedia.timestamp,
        dst_user_first_name: dstStation.user.firstName,
        dst_user_last_name: dstStation.user.lastName,
        dst_job_title: dstStation.user.jobTitle,
        dst_office_room: dstStation.user.officeRoom,
        dst_office_building: dstStation.user.officeBuilding,
        dst_phone: dstStation.user.phoneNumber,
        dst_email: dstStation.user.emailAddress,
        dst_media_path: dstMedia.path,
        dst_media_timestamp: dstMedia.timestamp
    });
}
