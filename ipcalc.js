import {
    calcNetwork,
    calcBroadcast,
    calcWildcard,
    calcFirstAddr,
    calcLastAddr,
    calcRangeLength,
} from './calc.js';
import {
    addrToNumber,
    numberToAddr,
    cidrToNumber,
} from './conversion.js';


const feedbackElement = document.querySelector("#feedback");
const input = document.querySelector('input');


const checkInput = (input) => {
    // return true if input is a valid IP Address CIDR notation else return false
    const ipv4_regex =
        /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

    const cidr = input.split('/');

    if (cidr.length != 2) return false;

    if (cidr[1] == '') return false;

    if (!ipv4_regex.test(cidr[0])) return false;

    if (cidr[1] <= 0 || cidr[1] >= 32) return false;

    return true;
}

const parseInput = (input) => {
    const inputArr = input.split('/');

    const ipInfo = {}

    ipInfo.address = addrToNumber(inputArr[0]);
    ipInfo.subnetMask = cidrToNumber(inputArr[1]);

    return ipInfo;
};

const calcIpv4 = (input) => {
    const ipInfo = parseInput(input);
    ipInfo.network = calcNetwork(ipInfo.address, ipInfo.subnetMask);
    ipInfo.wildcard = calcWildcard(ipInfo.subnetMask);
    ipInfo.broadcast = calcBroadcast(ipInfo.network, ipInfo.subnetMask);
    ipInfo.firstAddress = calcFirstAddr(ipInfo.network);
    ipInfo.lastAddress = calcLastAddr(ipInfo.network, ipInfo.subnetMask);
    ipInfo.rangeLength = calcRangeLength(ipInfo.subnetMask);

    return ipInfo;
}

const renderIpv4 = (ipInfo) => {
    document.querySelector('#netmask').textContent = numberToAddr(ipInfo.subnetMask);
    document.querySelector('#network').textContent = numberToAddr(ipInfo.network);
    document.querySelector('#wildcard').textContent = numberToAddr(ipInfo.wildcard);
    document.querySelector('#broadcast').textContent = numberToAddr(ipInfo.broadcast);
    document.querySelector('#first_addr').textContent = numberToAddr(ipInfo.firstAddress);
    document.querySelector('#last_addr').textContent = numberToAddr(ipInfo.lastAddress);
    document.querySelector('#range_length').textContent = ipInfo.rangeLength;
}

document.querySelector('#check').addEventListener('click', () => {
    feedbackElement.textContent = '';

    if (!checkInput(input.value)) {
        feedbackElement.textContent = 'Invalid CIDR';
        return;
    }

    const ipInfo = calcIpv4(input.value);

    renderIpv4(ipInfo);
});
