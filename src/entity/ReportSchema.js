const { ReportModel } = require('../model/ReportModel');

module.exports = {
    target: ReportModel,
    columns: {
        nidd_report_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        /*
        sid: {
            type: 'int'
        }
        cid: {
            type: 'int'
        },
        */
        hostname: {
            type: 'text'
        },
        /*
        interface: {
            type: 'text'
        },
        */
        signature: {
            type: 'int'
        },
        timestamp: {
            type: 'datetime'
        },
        /*
        sig_priority: {
            type: 'int'
        },
        sig_gid: {
            type: 'int'
        },
        sig_name: {
            type: 'varchar'
        },
        sig_rev: {
            type: 'int'
        },
        */
        ip_src: {
            type: 'bigint',
        },
        ip_dst: {
            type: 'bigint',
        },
        /*
        ip_ver: {
            type: 'tinyint'
        },
        ip_proto: {
            type: 'tinyint'
        },
        tcp_sport: {
            type: 'smallint'
        },
        tcp_dport: {
            type: 'smallint'
        },
        udp_sport: {
            type: 'smallint'
        },
        udp_dport: {
            type: 'smallint'
        },
        icmp_type: {
            type: 'tinyint'
        },
        icmp_code: {
            type: 'tinyint'
        },
        */
        src_user_first_name: {
            type: 'varchar'
        },
        src_user_last_name: {
            type: 'varchar'
        },
        src_job_title: {
            type: 'varchar'
        },
        src_office_room: {
            type: 'varchar'
        },
        src_office_building: {
            type: 'varchar'
        },
        src_phone_number: {
            type: 'varchar'
        },
        src_email: {
            type: 'varchar'
        },
        src_media_path: {
            type: 'text'
        },
        src_media_timestamp: {
            type: 'datetime'
        },
        dst_user_first_name: {
            type: 'varchar'
        },
        dst_user_last_name: {
            type: 'varchar'
        },
        dst_job_title: {
            type: 'varchar'
        },
        dst_office_room: {
            type: 'varchar'
        },
        dst_office_building: {
            type: 'varchar'
        },
        dst_phone_number: {
            type: 'varchar'
        },
        dst_email: {
            type: 'varchar'
        },
        dst_media_path: {
            type: 'text'
        },
        dst_media_timestamp: {
            type: 'datetime'
        }
    }
}
