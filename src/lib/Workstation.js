const { NIDDCamera } = require('./NIDDCamera');

class Workstation {
    constructor(user, ip, camera, pCoord, tCoord, zCoord, preset) {
        this.user = user;
        this.ip = ip;
        this.camera = camera;
        this.pCoord = pCoord;
        this.tCoord = tCoord;
        this.zCoord = zCoord;
        this.preset = preset;
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

    getSnapshot(niddCam) {
        return niddCam.get_snapshot();
    }
}

module.exports = {
    Workstation
};
