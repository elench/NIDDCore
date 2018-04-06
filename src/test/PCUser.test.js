const expect = require('chai').expect;
const { PCUser } = require('../lib/PCUser');

describe('PCUser', () => {
    describe('#PCUser', () => {
        it('should return a PCUser object with all desired properties', () => {
            const user = new PCUser();
            expect(user).to.have.property('userId');
            expect(user).to.have.property('firstName');
            expect(user).to.have.property('lastName');
            expect(user).to.have.property('jobTitle');
            expect(user).to.have.property('officeRoom');
            expect(user).to.have.property('officeBuilding');
            expect(user).to.have.property('phoneNumber');
            expect(user).to.have.property('emailAddress');
        });
    });

    describe('#PCUser: userId, firstName, ..., emailAddress', () => {
        it('should return PCUser with all properties set to a value', () => {
            const user = new PCUser(
                'userId',
                'firstName',
                'lastName',
                'jobTitle',
                'officeRoom',
                'officeBuilding',
                'phoneNumber',
                'emailAddress'
            );

            expect(user).to.deep.equal({
                userId: 'userId',
                firstName: 'firstName',
                lastName: 'lastName',
                jobTitle: 'jobTitle',
                officeRoom: 'officeRoom',
                officeBuilding: 'officeBuilding',
                phoneNumber: 'phoneNumber',
                emailAddress: 'emailAddress'
            });
        });
    });
});
