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

    set_preset(presetName, presetToken) {
        return new Promise((resolve, reject) => {
            this._camera.setPreset({
                presetName,
                presetToken
            },
            err => {
                if (err) reject(err);
                resolve(`Preset has been set to ${presetName}: ${presetToken}`);
            });
        });
    }

    remove_preset(presetToken) {
        return new Promise((resolve, reject) => {
            this._camera.removePreset({ presetToken },
            err => {
                if (err) reject(err);
                resolve(`Removing preset ${presetToken}`);
            });
        });
    }

    goto_coordinate(x, y, zoom) {
        return new Promise((resolve, reject) => {
            this._camera.absoluteMove({ x, y, zoom },
            err => {
                if (err) reject(err);
                resolve(`Moving to coordinate (${x}, ${y}, ${zoom})`)
            });
        });
    }

    goto_preset(number) {
        return new Promise((resolve, reject) => {
            this._camera.gotoPreset({
                preset: number
            },
            err => {
                if (err) reject(err);

                resolve(`Movint to preset ${number}`);
            });
        });
    }

    get_snapshot_uri() {
        return new Promise((resolve, reject) => {
            this._camera.getSnapshotUri((err, media) => {
                if (err) reject(err);
                resolve(media.uri);
            });
        });
    }

    get_stream_uri() {
        return new Promise((resolve, reject) => {
            this._camera.getStreamUri({
                protocol : 'RTSP'
            },
            (err, stream) => {
                if (err) reject(err);
                resolve(stream.uri);
            });
        });
    }

    open_stream() {
        const username = this._properties.username;
        const password = this._properties.password;
        return this.get_stream_uri()
        .then(uri => {
            const uriArr = uri.split('//');

            uri = uriArr[0] + '//'
                + username + ':' + password
                + '@' + uriArr[1];

            const { spawn } = require('child_process');
            const vlc = spawn('cvlc', [uri]);

            return 'Streaming using vlc';
        })
        .catch(err => {
            throw err;
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

    get_presets() {
        return new Promise((resolve, reject) => {
            this._camera.getPresets((err, presets) => {
                if (err) reject(err);
                resolve(presets);
            });
        });
    }

    get_device_info() {
        return new Promise((resolve, reject) => {
            this._camera.getDeviceInformation((err, info) => {
                if (err) reject(err);
                resolve(info);
            });
        });
    }

    reboot() {
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
