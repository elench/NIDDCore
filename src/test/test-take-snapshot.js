const req = require('request');
const fs = require('fs');
const { NIDDCamera } = require('../lib/NIDDCamera');

const properties = {
    hostname : '10.0.0.65',
    username : 'admin',
    password : 'neur0mancer',
    port : 80
};

let flag = false;
const camera = null;

new NIDDCamera(properties).connect().then(async camera => {

    /*
    let msg = await camera.get_something();
    console.log(msg);
    */

    //let secondCamera = await new NIDDCamera(properties).connect();
    // const uri = await camera.get_snapshot();

    const uri = await camera.get_snapshot();
    //const uri = `http://${camera.hostname}/cgi-bin/snapshot.cgi`;
    let msg;

    for (let i = 0; i < 1000; ++i) {
        //msg = await camera.goto_preset(2);
        msg = await camera.goto_preset(i % 4 + 1);
        msg = await getRequest(uri);
        console.log(`${i}: ${msg}`)
        //console.log(msg);
    }
    //console.log(await camera.get_something());

})
.catch(err => {
    console.log('Problem connecting', err);
});

function getRequest(uri) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let fecha = new Date();
            req.get(uri, { timeout: 60000 })
            .on('error', err => reject(err))
            .auth('admin', 'neur0mancer', false)
            .pipe(fs.createWriteStream(
                `../../snapshots/${fecha.getMinutes()}-${fecha.getSeconds()}.jpg`)
                .on('finish', () => {
                    resolve('finish!');
                })
            );
        }, 2500)
    });
}

function getRequest2(uri) {
    return new Promise((resolve, reject) => {
        req.get(uri, { timeout: 2000 })
        //.auth('admin', 'neur0mancer', false)
        .on('response', res => {
            resolve(res);
        });
    });
}
