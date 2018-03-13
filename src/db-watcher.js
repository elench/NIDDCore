const mysql = require('mysql-events');


const eventWatcher = mysql({
    host: 'localhost',
    user: 'root',
    password: 'toor'
});

/*
const watcher = eventWatcher.add(
    'niddcore.fakealert',
    function(oldRow, newRow, event) {
        process.send(newRow.fields);
    }
);
*/


let previousAlert = {};

const watcher = eventWatcher.add(
    'niddcore.fakealert',
    function(oldRow, newRow, event) {

        /*
        const set = new Set([previousAlert.src_ip, previousAlert.dst_ip,
            newRow.fields.src_ip, newRow.fields.dst_ip]);

        if (set.size === 2 && previousAlert.signature === newRow.fields.signature) {
            console.log('-$ alert discarded: duplicate');
        }
        else {
            previousAlert = newRow.fields;
            process.send(newRow.fields);
        }
        */
            process.send(newRow.fields);

    }
);



console.log('db-watcher: started');
