const { NIDDCamera } = require('./NIDDCamera');

class Workstation {
    constructor(user, ip, camera, pCoord, tCoord, zCoord, preset, uri) {
        this.user = user;
        this.ip = ip;
        this.camera = camera;
        this.pCoord = pCoord;
        this.tCoord = tCoord;
        this.zCoord = zCoord;
        this.preset = preset;
        this._uri = uri;
    }

    connectCameraPromise() {
        return new NIDDCamera({
            hostname: this.camera.hostname,
            username: this.camera.username,
            password: this.camera.password,
            port: this.camera.port
        })
        .connect();
    }

    gotoLocation(niddCam) {
        return niddCam.goto_preset(this.preset);
    }

    get snapshotUri(niddCam) {
        return this._uri;
    }

    set snapshotUri(uri) {
        this._uri = uri;
    }
}

module.exports = {
    Workstation
};
