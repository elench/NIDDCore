const expect = require('chai').expect;
const { Media } = require('../lib/Media');

describe('Media', () => {
    describe('#Media', () => {
        it('should return a Media object with all desired properties', () => {
            const media = new Media();
            expect(media).to.have.property('_path');
            expect(media).to.have.property('_timestamp');
        });
        it('should return a Media object with all properties set', () => {
            const timestamp = new Date();
            const path = 'a/path/to/a/media'
            const media = new Media(path, timestamp);
            expect(media).to.deep.equal({
                _path: path,
                _timestamp: timestamp
            });
        });
    });

    describe('#path', () => {
        it('should set and return the media path', () => {
            const media = new Media();
            const path = 'a/path/to/a/media'
            media.path = path;
            expect(media.path).to.equal(path);
        });
    });

    describe('#timestamp', () => {
        it('should set and return the media timestamp', () => {
            const media = new Media();
            const timestamp = new Date();
            media.timestamp = timestamp;
            expect(media.timestamp).to.equal(timestamp);
        });
    });

});
