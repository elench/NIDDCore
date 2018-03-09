class icmphdr {
    constructor() {
        this.sid = undefined;
        this.cid = undefined;
        this.icmp_type = undefined;
        this.icmp_code = undefined;
        this.icmp_csum = undefined;
        this.icmp_id = undefined;
        this.icmp_seq = undefined;
    }
}

module.exports.IcmpHdrModel = icmphdr;
