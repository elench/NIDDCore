class niddreport {
    constructor() {
        this.nidd_report_id = undefined;
        //this.sid = null;
        //this.cid = null;
        this.hostname = null;
        //this.interface = null;
        this.signature = null;
        this.timestamp = null;
        //this.sig_priority = null;
        //this.sig_gid = null;
        //this.sig_name = null;
        //this.sig_rev = null;
        this.ip_src = null;
        this.ip_dst = null;
        //this.ip_ver = null;
        //this.ip_proto = null;
        //this.tcp_sport = null;
        //this.tcp_dport = null;
        //this.udp_sport = null;
        //this.udp_dport = null;
        //this.icmp_type = null;
        //this.icmp_code = null;
        this.src_user_first_name = null;
        this.src_user_last_name = null;
        this.src_job_title = null;
        this.src_office_room = null;
        this.src_office_building = null;
        this.src_phone_number = null;
        this.src_email = null;
        this.src_media_path = null;
        this.src_media_timestamp = null;
        this.dst_user_first_name = null;
        this.dst_user_last_name = null;
        this.dst_job_title = null;
        this.dst_office_room = null;
        this.dst_office_building = null;
        this.dst_phone = null;
        this.dst_email = null;
        this.dst_media_path = null;
        this.dst_media_timestamp = null;
    }
}

module.exports.ReportModel = niddreport;
