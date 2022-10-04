import {
    calcNetwork,
    calcBroadcast,
    calcWildcard,
    calcFirstAddr,
    calcLastAddr,
    calcRangeLength,
} from "./calc.js";
import {
    addrToNumber,
    numberToAddr,
    cidrToNumber,
} from "./conversion.js";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#check").addEventListener("click", () => {
        initFeedback()

        let input = document.querySelector("input").value;
        if (!checkInput(input)) {
            renderWrongIpFeeback()
            return;
        }

        let ipInfo = calcIpv4(input);

        renderIpv4(ipInfo);
    });
});

function checkInput(input) {
    // return true if input is a valid IP Address CIDR notation else return false
    let ipv4_regex =
        /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

    const cidr = input.split("/");

    if (cidr.length != 2) return false;

    if (cidr[1] == "") return false;

    if (!ipv4_regex.test(cidr[0])) return false;

    if (cidr[1] <= 0 || cidr[1] >= 32) return false;

    return true;
}

function renderWrongIpFeeback() {
    feedback.innerHTML = "Invalid IP";
    feedback.className = "alert alert-secondary";
}

function parseInput(input) {
    input = input.split("/");

    let ipInfo = {}

    ipInfo['address'] = addrToNumber(input[0]);
    ipInfo['subnetMask'] = cidrToNumber(input[1]);

    return ipInfo;
}

function initFeedback() {
    let feedback = document.querySelector("#feedback");
    feedback.innerHTML = "";
    feedback.className = "";
}

function calcIpv4(input) {
    let ipInfo = parseInput(input);
    ipInfo['network'] = calcNetwork(ipInfo.address, ipInfo.subnetMask);
    ipInfo['wildcard'] = calcWildcard(ipInfo.subnetMask);
    ipInfo['broadcast'] = calcBroadcast(ipInfo.network, ipInfo.subnetMask);
    ipInfo['firstAddress'] = calcFirstAddr(ipInfo.network);
    ipInfo['lastAddress'] = calcLastAddr(ipInfo.network, ipInfo.subnetMask);
    ipInfo['rangeLength'] = calcRangeLength(ipInfo.subnetMask);

    return ipInfo;
}

function renderIpv4(ipInfo) {
    document.querySelector("#netmask").innerHTML = numberToAddr(ipInfo.subnetMask);
    document.querySelector("#network").innerHTML = numberToAddr(ipInfo.network);
    document.querySelector("#wildcard").innerHTML = numberToAddr(ipInfo.wildcard);
    document.querySelector("#broadcast").innerHTML = numberToAddr(ipInfo.broadcast);
    document.querySelector("#first_addr").innerHTML = numberToAddr(ipInfo.firstAddress);
    document.querySelector("#last_addr").innerHTML = numberToAddr(ipInfo.lastAddress);
    document.querySelector("#range_length").innerHTML = ipInfo.rangeLength;
}