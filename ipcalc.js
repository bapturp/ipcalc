// returns the network address
// & -> bitwise AND
const calcNetwork = (addr, netmask) => addr & netmask;

// returns the broadcast address
// | -> bitwise OR
// ~ -> bitwise complement (NOT), inverts all bits 0101 -> 1010
const calcBroadcast = (network, netmask) => network | ~netmask;

// returns the wildcard mask (inverted netmask)
// 255.255.255.0 -> 255.0.0.0
const calcWildcard = (netmask) => ~netmask;

// returns first assignable address
const calcFirstAddr = (network) => network + 1;

// returns last assignable address
const calcLastAddr = (network, netmask) => calcBroadcast(network, netmask) - 1;

// returns full range length
const calcRangeLength = (netmask) => ~netmask - 1;

// converts ipv4 address from String in dot-decimal notation to Number
// 192.168.0.1 -> 3232235521
const addrToNumber = (addr) =>
  addr
    .split(".")
    .reverse()
    .reduce((acc, val, i) => acc + Number(val) * 256 ** i, 0);

// convert ipv4 address from Number to a String in dot-decimal notation.
// 3232235521 -> "192.168.0.1"
const numberToAddr = (addr) => {
  const bytes = [];

  bytes[0] = addr & 0xff;
  bytes[1] = (addr >>> 8) & 0xff;
  bytes[2] = (addr >>> 16) & 0xff;
  bytes[3] = (addr >>> 24) & 0xff;

  return bytes.reverse().join(".");
};

// convert subnetnetmask from CIDR notation to Number
// 24 -> 4294967040
const cidrToNumber = (netmask) => 0xffffffff << (32 - netmask);

// convert mask from Number to Number CIDR notation
// 4294967040 -> 24 (/24)
const numberToCidr = (netmask) => {
  let cidr = 0;

  // 0x80000000 == 128.0.0.0 == /1
  for (let n = 0x80000000; (netmask & n) >>> 0 != 0; n >>>= 1) {
    cidr++;
  }

  return cidr;
};

const checkInput = (input) => {
  // returns true if input is a valid IP Address CIDR notation else return false
  const ipv4_regexp =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

  const cidr = input.split("/");

  if (cidr.length !== 2) return false;

  if (!ipv4_regexp.test(cidr[0])) return false;

  if (isNaN(cidr[1])) return false;

  if (cidr[1] <= 0 || cidr[1] >= 32) return false;

  return true;
};

const parseInput = (input) => {
  const inputArr = input.split("/");

  const ipInfo = {};

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
};

const renderIpv4 = (ipInfo) => {
  document.querySelector("#netmask").textContent = numberToAddr(
    ipInfo.subnetMask
  );

  document.querySelector("#network").textContent = numberToAddr(ipInfo.network);

  document.querySelector("#wildcard").textContent = numberToAddr(
    ipInfo.wildcard
  );

  document.querySelector("#broadcast").textContent = numberToAddr(
    ipInfo.broadcast
  );

  document.querySelector("#first_addr").textContent = numberToAddr(
    ipInfo.firstAddress
  );

  document.querySelector("#last_addr").textContent = numberToAddr(
    ipInfo.lastAddress
  );

  document.querySelector("#range_length").textContent = ipInfo.rangeLength;
};

const setNotification = (message) =>
  (document.querySelector("#notification").textContent = message);

const inputCidr = document.querySelector("input").value;

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  setNotification("");

  if (!checkInput(inputCidr)) {
    setNotification("Invalid CIDR");
    setTimeout(() => setNotification(""), 5000);
    return;
  }

  const ipInfo = calcIpv4(inputCidr);

  renderIpv4(ipInfo);
});
