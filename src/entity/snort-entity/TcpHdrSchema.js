const { TcpHdrModel } = require('../../model/snort-model/TcpHdrModel');

module.exports = {
    target: TcpHdrModel,
    columns: {
        sid: {
            primary: true,
            type: 'int'
        },
        cid: {
            primary: true,
            type: 'int'
        },
        tcp_sport: {
            type: 'smallint'
        },
        tcp_dport: {
            type: 'smallint'
        },
        tcp_seq: {
            type: 'int'
        },
        tcp_ack: {
            type: 'int'
        },
        tcp_off: {
            type: 'tinyint'
        },
        tcp_res: {
            type: 'tinyint'
        },
        tcp_flgas: {
            type: 'tinyint'
        },
        tcp_win: {
            type: 'smallint'
        },
        tcp_csum: {
            type: 'smallint'
        },
        tcp_urp: {
            type: 'smallint'
        }
    }
}
