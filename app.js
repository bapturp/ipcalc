function checkInput(input){
    // return true if input is a valid IP Address CIDR notation else return false
    let ipv4_regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

    const cidr = input.split('/');

    if (cidr.length != 2) {
        return false;
    }

    if (cidr[1] == "") {
        return false;
    }


    if (!ipv4_regex.test(cidr[0])) {
        return false;
    };

    if (cidr[1] <= 0 || cidr[1] > 32) {
        return false;
    };

    return true;
};

function cidrTon(netmask) {
    // return integer value of CIDR netmask
    // 24 -> 4294967040 (255.255.255.0)
    return 2**32 - 2**(32 - netmask);
}

function inetAton(addr) {
    // return integer value of an IPv4 dotted decimal address
    // "192.168.0.1" -> 3232235521
    let d = addr.split('.');
    return d[0] * 256**3 + d[1] * 256**2 + d[2]*256**1 + d[3]*256**0;
};

function inetNtoa(addr) {
    // return dotted decimal IPv4 address
    // 3232235521 -> "192.168.0.1"
    let bytes = [];
    bytes[0] = addr & 0xFF;
    bytes[1] = (addr >> 8) & 0xFF;
    bytes[2] = (addr >> 16) & 0xFF;
    bytes[3] = (addr >> 24) & 0xFF;
    return bytes[3] + "." + bytes[2] + "." + bytes[1] + "." + bytes[0];
};

function calcNetwork(addr, netmask) {
    // return a network address
    return addr & netmask; // & -> bitwise AND
}

function calcBroadcast(network, netmask) {
    // return broadcast address
    // | -> bitwise OR
    // ~ -> bitwise complement (NOT), inverts all bits 0101 -> 1010
    return network | (~netmask);
}

function calcWildcard(netmask) {
    // return wildcard (inverted mask)
    // 255.255.255.0 -> 255.0.0.0
    return ~netmask
}

function calcFirstAddr(network){
    return network + 1;
}

function calcLastAddr(network, netmask) {
    return (network | (~netmask)) - 1;
}

function calcRangeLength(netmask) {
    return (~netmask) - 1;
}

// run script once content is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#check').addEventListener('click', function() {

        let feedback = document.querySelector('#feedback');
        feedback.innerHTML = '';
        //document.querySelector('#feedback').innerHTML = '';

        const input = document.querySelector('input').value;
        if (!checkInput(input)) {
            feedback.innerHTML = 'Invalid IP';
            feedback.className = 'alert alert-secondary';
            return;
        } else {
            feedback.innerHTML = '';
            feedback.className = '';
        }

        input_split = input.split('/')
        const input_addr = input_split[0]
        const input_mask = input_split[1] 
        
        const addr = inetAton(input_addr);
        const netmask = cidrTon(input_mask);

        const network = calcNetwork(addr, netmask);
        const broadcast = calcBroadcast(network, netmask);
        const wildcard = calcWildcard(netmask);

        const rangeLength = calcRangeLength(netmask);

        const firstAddr = calcFirstAddr(network);
        const last_addr = calcLastAddr(network, netmask);

        document.querySelector('#netmask').innerHTML = inetNtoa(netmask);
        document.querySelector('#wildcard').innerHTML = inetNtoa(wildcard);
        document.querySelector('#network').innerHTML = inetNtoa(network);
        document.querySelector('#broadcast').innerHTML = inetNtoa(broadcast);
        document.querySelector('#first_addr').innerHTML = inetNtoa(firstAddr);
        document.querySelector('#last_addr').innerHTML = inetNtoa(last_addr);
        document.querySelector('#range_length').innerHTML = rangeLength
    });
});