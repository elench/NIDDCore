const mysql = require('mysql-events');

const eventWatcher = mysql({
    host: 'localhost',
    user: 'root',
    password: 's3cr3t'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'dbwatcher',
        password: 'nidd2018',
        database: 'niddtestdb'
    }
});


let prevAlert = {};

eventWatcher.add('niddtestdb.event',
    function(oldRow, newRow, event) {
        // Wait 200 milliseconds to give barnyard2 enough time to finish
        // writing data to database
        setTimeout(() => {
            getSnortAlert(newRow.fields)
            .then(snortAlert => {
                const set = new Set([
                    prevAlert.ip_src,
                    prevAlert.ip_dst,
                    snortAlert.ip_src,
                    snortAlert.ip_dst
                ]);
                console.log(set);

                if (set.size === 2 &&
                    snortAlert.signature === prevAlert.signature) {
                    console.log('-$ duplicate discarded');
                }
                else {
                    console.log('snortAlert:', snortAlert);
                    prevAlert.ip_src = snortAlert.ip_src;
                    prevAlert.ip_dst = snortAlert.ip_dst;
                    prevAlert.signature = snortAlert.signature;
                    setTimeout(() => {
                        prevAlert = {};
                    }, 2000);
                }
                //process.send(snortAlert);
            })
            .catch(err => {
                console.log(err);
            });
        }, 200);
    }
);

function getSnortAlert(snortEvent) {
    return knex('event')
    .where('sid', snortEvent.sid).andWhere('cid', snortEvent.cid)
    .then(async ([ event ]) => {
        const [ sensor ] = await knex('sensor')
            .where('sid', event.sid);

        const [ signature ] = await knex('signature')
            .where('sig_id', event.signature);

        const [ iphdr ] = await knex('iphdr')
            .where('sid', event.sid)
            .andWhere('cid', event.cid);

        const [ tcphdr ] = await knex('tcphdr')
            .where('sid', event.sid)
            .andWhere('cid', event.cid);

        const [ udphdr ] = await knex('udphdr')
            .where('sid', event.sid)
            .andWhere('cid', event.cid);

        const [ icmphdr ] = await knex('icmphdr')
            .where('sid', event.sid)
            .andWhere('cid', event.cid);

        const snortAlert = {
            sid         : event.sid,
            cid         : event.cid,
            hostname    : sensor ? sensor.hostname : null,
            interface   : sensor ? sensor.interface : null,
            signature   : event.signature,
            timestamp   : event.timestamp,
            sig_priority: signature ? signature.sig_priority : null,
            sig_gid     : signature ? signature.sig_gid : null,
            sig_name    : signature ? signature.sigName : null,
            sig_rev     : signature ? signature.sig_rev : null,
            ip_src      : iphdr ? iphdr.ip_src : null,
            ip_dst      : iphdr ? iphdr.ip_dst : null,
            ip_ver      : iphdr ? iphdr.ip_ver : null,
            ip_proto    : iphdr ? iphdr.ip_proto : null,
            tcp_sport   : tcphdr ? tcphdr.tcp_sport : null,
            tcp_dport   : tcphdr ? tcphdr.tcp_dport : null,
            udp_sport   : udphdr ? udphdr.udp_sport : null,
            udp_dport   : udphdr ? udphdr.udp_dport : null,
            icmp_type   : icmphdr ? icmphdr.icmp_type : null,
            icmp_code   : icmphdr ? icmphdr.icmp_code : null
        }

        return snortAlert;
    })
    .catch(err => {
        return null;
    });
}

console.log('db-watcher: started');
