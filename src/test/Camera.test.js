const expect = require('chai').expect;
const { Camera } = require('../lib/Camera');

describe('Camera', () => {
    describe('#Camera', () => {
        it('should return a Camera object with all desired properties', () => {
            const cam = new Camera();
            expect(cam).to.have.property('hostname');
            expect(cam).to.have.property('username');
            expect(cam).to.have.property('password');
            expect(cam).to.have.property('port');
            expect(cam).to.have.property('ready');
        });
    })

    describe('#Camera: hostname, username, ..., ready', () => {
        it('should return a Camera object with all properties set to a value', () => {
            const cam = new Camera(
                'hostname',
                'username',
                'password',
                80,
                true,
            );

            expect(cam).to.deep.equal({
                hostname: 'hostname',
                username: 'username',
                password: 'password',
                port: 80,
                ready: true
            });
        });
    });
});
