const { UdpHdrModel } = require('../../model/snort-model/UdpHdrModel');

module.exports = {
    target: UdpHdrModel,
    columns: {
        sid: {
            primary: true,
            type: 'int',
        },
        cid: {
            primary: true,
            type: 'int',
        },
        udp_sport: {
            type: 'smallint'
        },
        udp_dport: {
            type: 'smallint'
        },
        udp_len: {
            type: 'smallint'
        },
        udp_csum: {
            type: 'smallint'
        }
    }
}
