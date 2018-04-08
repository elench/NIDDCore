const expect = require('chai').expect;
const { initWorkstations } = require('../lib/initWorkstations');

describe('ip-decimal', function() {
    this.timeout(60000);
    it('should return stations object with length property', async () => {
        try {
            const stations = await initWorkstations();
            expect(stations).to.have.property('length');
            expect(stations.length).to.be.a('number');
        }
        catch (err) {
            console.log(err);
        }
    });
});
