const mysql = require('mysql-events');

const eventWatcher = mysql({
    host: 'localhost',
    user: 'root',
    password: 'toor'
});


const watcher = eventWatcher.add(
    'niddcore.fakealert',
    function(oldRow, newRow, event) {
        console.log('db-watcher:', newRow.fields)
    }
);

console.log('db-watcher: started');
