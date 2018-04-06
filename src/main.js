const { fork } = require('child_process');
const niddEvent = require('./lib/NIDDEvent').createNiddEvent();
const { initWorkstations } = require('./lib/initWorkstations');
const { Workstation } = require('./lib/Workstation');
const { decToIp } = require('./lib/ip-decimal');

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
    console.log('|------- main: received niddAlert from watcher ------|');
    console.log(snortAlert);
    console.log('|------------------------------------------------|');

    const niddAlert = {
        snortAlert,
        srcStation: stations[decToIp(snortAlert.ip_src)] ||
                    stations['void'],
        dstStation: stations[decToIp(snortAlert.ip_dst)] ||
                    stations['void']
    };

    if (niddAlert.srcStation.user.userId === '' &&
        niddAlert.dstStation.user.userId === '') {
        console.log('-> niddAlert discarded');
    }
    else if (niddAlert.srcStation.camera.ready && niddAlert.dstStation.camera.ready) {
        processEvent(niddAlert);
        console.log('-> main: niddAlert sent to processor');
    }
    else {
        eventList.push(niddAlert);
        console.log('-> main: niddAlert enqueued');
    }

});


niddEvent.on('ready', () => {
    const niddAlert = getNextEventFromQueue();
    processEvent(niddAlert);
});


function processEvent(niddAlert) {
    if (!niddAlert) return null;

    console.log('-> eventList.length =', eventList.length)

    setStationsReady(niddAlert.srcStation, niddAlert.dstStation, false);

    console.log('-> sending niddAlert to processor: ', niddAlert.snortAlert);
    const processor = fork('./src/event-processor.js');
    processor.send(niddAlert);

    processor.on('message', ready => {
        console.log('-> received exit message from event-processor:', ready);
        setStationsReady(niddAlert.srcStation, niddAlert.dstStation, true);
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
