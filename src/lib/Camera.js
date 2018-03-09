class Camera {
    constructor(hostname, username, password, port) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
        this.port = port;
        this.ready = true;
    }

    /*
    get hostname() {
        return this._hostname;
    }

    get port() {
        return this._port;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }

    get ready() {
        return this._ready;
    }
    */
}

module.exports = {
    Camera
};
