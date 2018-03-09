class Media {
    constructor(path, timestamp) {
        this._path = path;
        this._timestamp = timestamp;
    }

    set path(path) {
        this._path = path;
    }
    set timestamp(timestamp) {
        this._timestamp = timestamp;
    }
    get path() {
        return this._path;
    }
    get timestamp() {
        return this._timestamp;
    }
}

module.exports.Media = Media;
