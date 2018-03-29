const { fork } = require('child_process');
const niddEvent = require('./lib/NIDDEvent').createNiddEvent();
const { initWorkstations } = require('./lib/initWorkstations');
const { Workstation } = require('./lib/Workstation');

const eventList = [];
const watcher = fork('./src/db-watcher.js');
let stations = null;

initWorkstations().then(result => {
    stations = result;
    console.log('Total workstations:', stations.length - 1);
})
.catch(err => {
    console.log('calling init():', err);
});

watcher.on('message', snortAlert => {
    console.log('|------- main: received event from watcher ------|');
    console.log(snortAlert);
    console.log('|------------------------------------------------|');

    const event = {
        snortAlert,
        srcStation: stations[snortAlert.ip_src] ||
                    stations['void'],
        dstStation: stations[snortAlert.ip_dst] ||
                    stations['void']
    };

    console.log(event);

    if (event.srcStation.user.userId === '' &&
        event.dstStation.user.userId === '') {
        console.log('-> event discarded');
    }
    else if (event.srcStation.camera.ready && event.dstStation.camera.ready) {
        processEvent(event);
        console.log('-> main: event sent to processor');
    }
    else {
        eventList.push(event);
        console.log('-> main: event enqueued');
    }

});


niddEvent.on('ready', () => {
    const event = getNextEventFromQueue();
    processEvent(event);
});


function processEvent(event) {
    if (!event) return null;

    console.log('-> eventList.length =', eventList.length)

    setStationsReady(event.srcStation, event.dstStation, false);

    console.log('-> sending event to processor: ', event.snortAlert);
    const processor = fork('./src/event-processor.js');
    processor.send(event);

    processor.on('message', ready => {
        setStationsReady(event.srcStation, event.dstStation, true);
    });
}

function getNextEventFromQueue() {
    for (let i = 0, len = eventList.length; i < len; ++i) {
        if (eventList[i].srcStation.camera.ready &&
            eventList[i].dstStation.camera.ready) {
            return eventList.splice(i, 1)[0];
        }
    }
}

function setStationsReady(s1, s2, ready) {
    s1.camera.ready = ready;
    s2.camera.ready = ready;
    if (ready) niddEvent.emit('ready');
}

console.log('main: started');
