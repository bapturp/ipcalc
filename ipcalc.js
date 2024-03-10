const calculateNetmask = (mask) => 0xffffffff << (32 - parseInt(mask))

const getNetwork = (addr, netmask) => addr & netmask

const getBroadcast = (network, netmask) => network | ~netmask

const getWildcard = (netmask) => ~netmask

const getFirstAddr = (network) => network + 1

const getLastAddr = (network, netmask) => (network | ~netmask) - 1

const getUsableHosts = (netmask) => ~netmask - 1

const convertIPv4 = (ip, direction) => {
  switch (direction) {
    case "addrToNumber":
      return ip
        .split(".")
        .reverse()
        .reduce((acc, val, i) => acc + Number(val) * 256 ** i, 0)
    case "numberToAddr":
      const bytes = []
      bytes[0] = (ip >>> 24) & 0xff
      bytes[1] = (ip >>> 16) & 0xff
      bytes[2] = (ip >>> 8) & 0xff
      bytes[3] = ip & 0xff
      return bytes.join(".")
  }
}

const validateCIDR = (input) => {
  const reIpv4 =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm

  const cidr = input.split("/")

  if (cidr.length !== 2) throw new Error("Invalid CIDR format")
  if (!reIpv4.test(cidr[0])) throw new Error("Invalid IPv4 address")
  if (isNaN(cidr[1])) throw new Error("Invalid netmask")
  if (cidr[1] <= 0 || cidr[1] >= 32) throw new Error("Netmask out of range")
}

const renderIPv4 = (inputCIDR) => {
  try {
    validateCIDR(inputCIDR)
  } catch (error) {
    setNotification(error.message)
    setTimeout(() => setNotification(""), 5000)
    return
  }

  const [ipString, netmaskString] = inputCIDR.split("/")
  const ip = convertIPv4(ipString, "addrToNumber")
  const netmask = calculateNetmask(netmaskString)
  const network = getNetwork(ip, netmask)

  const IPv4Info = {
    network: convertIPv4(network, "numberToAddr"),
    netmask: convertIPv4(netmask, "numberToAddr"),
    wildcard: convertIPv4(getWildcard(netmask), "numberToAddr"),
    broadcast: convertIPv4(getBroadcast(network, netmask), "numberToAddr"),
    firstAddress: convertIPv4(getFirstAddr(network), "numberToAddr"),
    lastAddress: convertIPv4(getLastAddr(network, netmask), "numberToAddr"),
    rangeLength: getUsableHosts(netmask),
  }

  for (const [key, value] of Object.entries(IPv4Info)) {
    document.getElementById(key).textContent = value
  }
}

const setNotification = (message) =>
  (document.getElementById("notification").textContent = message)

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
  setNotification("")

  const inputCIDR = document.getElementById("input-cidr").value

  renderIPv4(inputCIDR)
})
