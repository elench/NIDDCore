class iphdr {
    constructor() {
        this.sid = undefined;
        this.cid = undefined;
        this.ip_src = undefined;
        this.ip_dst = undefined;
        this.ip_ver = undefined;
        this.ip_hlen = undefined;
        this.ip_tos = undefined;
        this.ip_len = undefined;
        this.ip_id = undefined;
        this.ip_flags = undefined;
        this.ip_off = undefined;
        this.ip_ttl = undefined;
        this.ip_proto = undefined;
        this.ip_csum = undefined;
    }
}

module.exports.IpHdrModel = iphdr;
