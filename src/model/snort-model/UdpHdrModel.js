class udphdr {
    constructor() {
        this.sid = undefined;
        this.cid = undefined;
        this.udp_sport = undefined;
        this.udp_dport = undefined;
        this.udp_len = undefined;
        this.udp_csum = undefined;
    }
}

module.exports.UdpHdrModel = udphdr;
