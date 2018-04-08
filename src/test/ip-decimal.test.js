const expect = require('chai').expect;
const ipdec = require('../lib/ip-decimal');

describe('ip-decimal', () => {
    describe('#decToIp', () => {
        it('should convert a decimal number to a dotted decimal IP number', () => {
            const dotted = ipdec.decToIp(2130706433);
            expect(dotted).to.be.a('string').and.to.be.equal('127.0.0.1');
        });
    });

    describe('#ipToDec', () => {
        it('should convert an IP address in dotted decimal format to a decimal number', () => {
            const decimal = ipdec.ipToDec('127.0.0.1');
            expect(decimal).to.be.a('number').and.to.be.equal(2130706433);
        });
    });
});
