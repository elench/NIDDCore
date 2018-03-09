class sensor {
    constructor() {
        this.sid = undefined;
        this.hostname = undefined;
        this.interface = undefined;
        this.filter = undefined;
        this.detail = undefined;
        this.encoding = undefined;
        this.last_cid = undefined;
    }
}

module.exports.SensorModel = sensor;
