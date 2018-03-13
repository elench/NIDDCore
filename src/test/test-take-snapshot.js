const req = require('request');
const fs = require('fs');
const { NIDDCamera } = require('../lib/NIDDCamera');

const properties = {
    hostname : '10.10.10.59',
    username : 'admin',
    password : 'neur0mancer',
    port : 80
};

let flag = false;
const camera = null;

new NIDDCamera(properties).connect().then(async camera => {

    const uri =  `http://${camera.username}:${camera.password}@${camera.hostname}/onvifsnapshot/media_service/snapshot?channel=1&subtype=0`;
    console.log(uri);
    let msg;

    for (let i = 0; i < 1; ++i) {
        msg = await camera.goto_preset(i % 4 + 1);
        msg = await getRequest(uri);
        console.log(`${i}: ${msg}`)
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
            req({url: uri}, (err, response, body) => {

                console.log(uri);
                console.log(response.statusCode);
            });
            /*
            .on('response', res => {
                console.log(res);
            })
            .on('error', err => reject(err))
            //.auth('admin', 'neur0mancer', false)
            .pipe(fs.createWriteStream(
                `../../snapshots/${fecha.getMinutes()}-${fecha.getSeconds()}.jpg`)
                .on('finish', () => {
                    resolve('finish!');
                })
            );
            */
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
