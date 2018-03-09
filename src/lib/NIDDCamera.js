const { Cam } = require('onvif');
const req = require('request');
const fs = require('fs');
const { Media } = require('./Media');

class NIDDCamera {
    constructor(prop) {
        this._properties = prop;
        this._camera = null;
    }

    get hostname() {
        return this._properties.hostname;
    }

    get username() {
        return this._properties.username;
    }

    get password() {
        return this._properties.password;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this._camera = new Cam(this._properties, err => {
                if (err) {
                    reject('Problem creating camera!', err);
                }
                //resolve('created!');
                resolve(this);
            });
        });
    }

    goto_preset(number) {
        return new Promise((resolve, reject) => {
            this._camera.gotoPreset({
                preset: number
            }, (err, stream, xml) => {
                if (err) reject(err);

                resolve(`goto_preset: ${number}`);
            });
        });
    }

    get_snapshot() {
        return new Promise((resolve, reject) => {
            this._camera.getSnapshotUri((err, media) => {
                if (err) reject(err);
                resolve(media.uri);
            });
        });
    }

    get_status() {
        return new Promise((resolve, reject) => {
            this._camera.getStatus((err, status) => {
                if (err) reject(err);

                resolve(status);
            });
        });
    }

    get_something() {
        return new Promise((resolve, reject) => {
            this._camera.systemReboot((err, msg) => {
                if (err) reject(err);
                resolve(msg);
            });
        });
    }

}

module.exports = {
    NIDDCamera
};
