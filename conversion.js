export function addrToNumber(addr) {
    // convert ipv4 address from String in dot-decimal notation to Number
    // 192.168.0.1 -> 3232235521
    const d = addr.split(".");

    return (
        d[0] * 256 ** 3 + d[1] * 256 ** 2 + d[2] * 256 ** 1 + d[3] * 256 ** 0
    );
}

export function numberToAddr(addr) {
    // convert ipv4 address from Number to a String in dot-decimal notation.
    // 3232235521 -> "192.168.0.1"
    const bytes = [];
    bytes[0] = addr & 0xff;
    bytes[1] = (addr >>> 8) & 0xff;
    bytes[2] = (addr >>> 16) & 0xff;
    bytes[3] = (addr >>> 24) & 0xff;

    return bytes[3] + "." + bytes[2] + "." + bytes[1] + "." + bytes[0];
}

export function cidrToNumber(netmask) {
    // convert subnetnetmask from CIDR notation to Number
    // 24 -> 4294967040

    return 0xffffffff << (32 - netmask);
}

export function numberToCidr(netmask) {
    // convert mask from Number to Number CIDR notation
    // 4294967040 -> 24 (/24)

    let cidr = 0;

    // 0x80000000 == 128.0.0.0 == /1
    for (let n = 0x80000000; (netmask & n) >>> 0 != 0; n >>>= 1) {
        cidr++;
    }

    return cidr;
}
