function ipToDec(ip) {
    const octets = address.split('.');
    octets.forEach((x, i, a) => a[i] = parseInt(x));

    if (!isValidIpAddress(octets)) {
        throw Error('not valid ip address');
    }

    const dec = octets[0] * 16777216 +  // * 256 ^ 3
                octets[1] * 65536 +     // * 256 ^ 2
                octets[2] * 256 +       // * 256 ^ 1
                octets[3];              // * 256 ^ 0

    return dec;
}

function decToIp(dec) {
    if (!isValidIpDecimal(dec)) {
        throw Error('not valid ip address decimal format');
    }

    let hexStr = dec.toString(16);
    const hexArr = [];

    if (hexStr.length % 2 !== 0) {
        hexStr = '0' + hexStr;
    }

    for (let i = 0; i < hexStr.length; i += 2) {
        hexArr.push(parseInt(hexStr.substring(i, i+2), 16));
    }

    let part = '';
    for (let i = 0; i < 4 - hexArr.length; ++i) {
        part += '0.';
    }

    return part + hexArr.join('.');

}

function isValidIpAddress(address) {
    if (address.length !== 4) {
        return false;
    }

    if (address.every(x => x >= 0 && x <= 255) === false) {
        return false;
    }

    return true;
}

function isValidIpDecimal(address) {
    if (isNaN(address) || address < 0 || address > Math.pow(2, 32)) {
        return false;
    }

    return true;
}

module.exports = {
    ipToDec,
    decToIp
}
