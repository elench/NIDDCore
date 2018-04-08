const expect = require('chai').expect;
const { NIDDCamera } = require('../lib/NIDDCamera');

describe('NIDDCamera', () => {
    const cam = new NIDDCamera({
        hostname: 'hostname',
        username: 'username',
        password: 'password',
        port: 80,
        ready: true,
    });

    describe('#NIDDCamera', () => {
        it('should return a NIDDCamera object with all properties set to a value', () => {
            expect(cam._properties).to.deep.equal({
                hostname: 'hostname',
                username: 'username',
                password: 'password',
                port: 80,
                ready: true,
            });
        });
    });

    describe('#hostname', () => {
        it('should return the NIDDCamera object hostname', () => {
            expect(cam.hostname).to.equal('hostname');
        });
    });

    describe('#username', () => {
        it('should return the NIDDCamera object username', () => {
            expect(cam.username).to.equal('username');
        });

    });

    describe('#password', () => {
        it('should return the NIDDCamera object password', () => {
            expect(cam.password).to.equal('password');
        });

    });

});
