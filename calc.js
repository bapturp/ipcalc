export const calcNetwork = (addr, netmask) => {
    // return the network address
    // & -> bitwise AND
    return addr & netmask;
}

export const calcBroadcast = (network, netmask) => {
    // return the broadcast address
    // | -> bitwise OR
    // ~ -> bitwise complement (NOT), inverts all bits 0101 -> 1010
    return network | ~netmask;
}

export const calcWildcard = (netmask) => {
    // return the wildcard mask (inverted netmask)
    // 255.255.255.0 -> 255.0.0.0
    return ~netmask;
}

export const calcFirstAddr = (network) => {
    // return first assignable address
    return network + 1;
}

export const calcLastAddr = (network, netmask) => {
    // return last assignable address
    return calcBroadcast(network, netmask) - 1;
}

export const calcRangeLength = (netmask) => {
    // return full range length
    return ~netmask - 1;
}
