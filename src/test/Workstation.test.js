const expect = require('chai').expect;
const { Workstation } = require('../lib/Workstation');
const { PCUser } = require('../lib/PCUser');
const { Camera } = require('../lib/Camera');

describe('Workstation', () => {
    const station = new Workstation(
        new PCUser(
            'userId',
            'firstName',
            'lastName',
            'jobTitle',
            'officeRoom',
            'officeBuilding',
            'phoneNumber',
            'emailAddress'
        ),
        '127.0.0.1',
        new Camera(
            'hostname',
            'username',
            'password',
            80,
            true
        ),
        0.5,
        0.5,
        0.5,
        1,
        'http://camera/snapshot'
    );

    describe('#Workstation', () => {
        it('should return a Workstation object with all properties set to a value', () => {
            expect(station).to.deep.equal({
                user: {
                    userId: 'userId',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    jobTitle: 'jobTitle',
                    officeRoom: 'officeRoom',
                    officeBuilding: 'officeBuilding',
                    phoneNumber: 'phoneNumber',
                    emailAddress: 'emailAddress'
                },
                ip: '127.0.0.1',
                camera: {
                    hostname: 'hostname',
                    username: 'username',
                    password: 'password',
                    port: 80,
                    ready: true
                },
                pCoord: 0.5,
                tCoord: 0.5,
                zCoord: 0.5,
                preset: 1,
                uri: 'http://camera/snapshot'
            });
        });
    });

});
