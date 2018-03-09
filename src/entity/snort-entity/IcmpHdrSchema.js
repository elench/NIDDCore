const { IcmpHdrModel } = require('../../model/snort-model/IcmpHdrModel');

module.exports = {
    target: IcmpHdrModel,
    columns: {
        sid: {
            primary: true,
            type: 'int'
        },
        cid: {
            primary: true,
            type: 'int'
        },
        icmp_type: {
            type: 'tinyint'
        },
        icmp_code: {
            type: 'tinyint'
        },
        icmp_csum: {
            type: 'smallint'
        },
        icmp_id: {
            type: 'smallint'
        },
        icmp_seq: {
            type: 'smallint'
        }
    }
}
