export function calcNetwork(addr, netmask) {
    // return a network address
    // & -> bitwise AND
    return addr & netmask;
}

export function calcBroadcast(network, netmask) {
    // return broadcast address
    // | -> bitwise OR
    // ~ -> bitwise complement (NOT), inverts all bits 0101 -> 1010
    return network | ~netmask;
}

export function calcWildcard(netmask) {
    // return wildcard (inverted netmask)
    // 255.255.255.0 -> 255.0.0.0
    return ~netmask;
}

export function calcFirstAddr(network) {
    // return first assignable address
    return network + 1;
}

export function calcLastAddr(network, netmask) {
    // return last assignable address
    return calcBroadcast(network, netmask) - 1;
}

export function calcRangeLength(netmask) {
    // return full range length
    return ~netmask - 1;
}
