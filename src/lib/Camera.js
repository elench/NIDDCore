class Camera {
    constructor(hostname, username, password, port) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
        this.port = port;
        this.ready = true;
    }
}

module.exports = {
    Camera
};
