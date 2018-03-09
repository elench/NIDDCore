class tcphdr {
    constructor() {
        this.sid = undefined;
        this.cid = undefined;
        this.tcp_sport = undefined;
        this.tcp_dport = undefined;
        this.tcp_seq = undefined;
        this.tcp_ack = undefined;
        this.tcp_off = undefined;
        this.tcp_res = undefined;
        this.tcp_flags = undefined;
        this.tcp_win = undefined;
        this.tcp_csum = undefined;
        this.tcp_urp = undefined;
    }
}

module.exports.TcpHdrModel = tcphdr;
