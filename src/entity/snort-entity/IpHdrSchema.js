const { IpHdrModel } = require('../../model/snort-model/IpHdrModel');

module.exports = {
    target: IpHdrModel,
    columns: {
        sid: {
            primary: true,
            type: 'int'
        },
        cid: {
            primary: true,
            type: 'int'
        },
        ip_src: {
            type: 'int'
        },
        ip_dst: {
            type: 'int'
        },
        ip_ver: {
            type: 'tinyint'
        },
        ip_hlen: {
            type: 'tinyint'
        },
        ip_tos: {
            type: 'tinyint'
        },
        ip_len: {
            type: 'smallint'
        },
        ip_id: {
            type: 'smallint'
        },
        ip_flags: {
            type: 'tinyint'
        },
        ip_off: {
            type: 'smallint'
        },
        ip_ttl: {
            type: 'tinyint'
        },
        ip_proto: {
            type: 'tinyint'
        },
        ip_csum: {
            type: 'smallint'
        }
    }
}
