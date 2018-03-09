const EventEmitter = require('events');
class NiddEvent extends EventEmitter {}

function createNiddEvent() {
    return new NiddEvent();
}

module.exports = {
    createNiddEvent
}
