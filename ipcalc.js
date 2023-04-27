const getNetwork = (addr, netmask) => addr & netmask;

const getBroadcast = (network, netmask) => network | ~netmask;

const getWildcard = (netmask) => ~netmask;

const getFirstAddr = (network) => network + 1;

const getLastAddr = (network, netmask) => (network | ~netmask) - 1;

const getRangeLength = (netmask) => ~netmask - 1;

const addrToNumber = (addr) =>
  addr
    .split(".")
    .reverse()
    .reduce((acc, val, i) => acc + Number(val) * 256 ** i, 0);

const numberToAddr = (addr) => {
  const bytes = [];

  bytes[0] = (addr >>> 24) & 0xff;
  bytes[1] = (addr >>> 16) & 0xff;
  bytes[2] = (addr >>> 8) & 0xff;
  bytes[3] = addr & 0xff;

  return bytes.join(".");
};

const cidrToNumber = (netmask) => 0xffffffff << (32 - netmask);

const numberToCidr = (netmask) => {
  let cidr = 0;

  for (let n = 0x80000000; (netmask & n) >>> 0 != 0; n >>>= 1) {
    cidr++;
  }

  return cidr;
};

const checkInput = (input) => {
  const reIpv4 =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

  const cidr = input.split("/");

  if (cidr.length !== 2) return false;

  if (!reIpv4.test(cidr[0])) return false;

  if (isNaN(cidr[1])) return false;

  if (cidr[1] <= 0 || cidr[1] >= 32) return false;

  return true;
};

const renderIpv4 = (inputCidr) => {
  const ipAndMask = (inputCidr) => {
    const [ipAddr, mask] = inputCidr.split("/");
    return [addrToNumber(ipAddr), cidrToNumber(mask)];
  };

  const getIpv4Info = (ipAddr, netMask) => {
    const network = getNetwork(ipAddr, netMask);
    const wildcard = getWildcard(netMask);
    const broadcast = getBroadcast(network, netMask);
    const firstAddress = getFirstAddr(network);
    const lastAddress = getLastAddr(network, netMask);
    const rangeLength = getRangeLength(netMask);

    const ipInfo = {
      network: numberToAddr(network),
      netMask: numberToAddr(netMask),
      wildcard: numberToAddr(wildcard),
      broadcast: numberToAddr(broadcast),
      firstAddress: numberToAddr(firstAddress),
      lastAddress: numberToAddr(lastAddress),
      rangeLength,
    };

    return ipInfo;
  };

  const [ipAddr, netMask] = ipAndMask(inputCidr);

  const ipInfo = getIpv4Info(ipAddr, netMask);

  for (const [key, value] of Object.entries(ipInfo)) {
    document.getElementById(key).textContent = value;
  }
};

const setNotification = (message) =>
  (document.getElementById("notification").textContent = message);

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  setNotification("");

  const inputCidr = document.getElementById("inputCidr").value;

  if (checkInput(inputCidr)) {
    renderIpv4(inputCidr);
  } else {
    setNotification("Invalid CIDR");
    setTimeout(() => setNotification(""), 5000);
  }
});
