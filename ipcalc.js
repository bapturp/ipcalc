// convert the netmask from CIDR notation to number
const calculateNetmask = (mask) => 0xffffffff << (32 - parseInt(mask))

// calculate the network address
const getNetwork = (ip, netmask) => ip & netmask

// calculate the broadcast address
const getBroadcast = (network, netmask) => network | ~netmask

// calculate the wilcard mask
const getWildcard = (netmask) => ~netmask

// calculte the first usable address
const getFirstAddr = (network) => network + 1

// calculate the last usable address
const getLastAddr = (network, netmask) => (network | ~netmask) - 1

// calculte the number of usable host addresses
const getUsableHosts = (netmask) => ~netmask - 1

// convert in both direction number to dot-decimal notation
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
  const cidr = input.split("/")
  if (cidr.length !== 2) throw new Error("Invalid CIDR format")
  const reIpv4 =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm
  if (!reIpv4.test(cidr[0])) throw new Error("Invalid IPv4 address")
  if (isNaN(cidr[1])) throw new Error("Invalid netmask")
  if (cidr[1] <= 0 || cidr[1] >= 32) throw new Error("Netmask out of range")
}

const renderIPv4 = (inputCIDR) => {
  try {
    validateCIDR(inputCIDR)
    const cidr = inputCIDR.split("/")
    const ip = convertIPv4(cidr[0], "addrToNumber")
    const netmask = calculateNetmask(cidr[1])
    const network = getNetwork(ip, netmask)

    const IPv4Info = {
      network: convertIPv4(network, "numberToAddr"),
      netmask: convertIPv4(netmask, "numberToAddr"),
      wildcard: convertIPv4(getWildcard(netmask), "numberToAddr"),
      broadcast: convertIPv4(getBroadcast(network, netmask), "numberToAddr"),
      firstAddress: convertIPv4(getFirstAddr(network), "numberToAddr"),
      lastAddress: convertIPv4(getLastAddr(network, netmask), "numberToAddr"),
      usableHosts: getUsableHosts(netmask),
    }

    for (const [key, value] of Object.entries(IPv4Info)) {
      document.getElementById(key).textContent = value
    }
  } catch (error) {
    errorMessage(error.message)
    setTimeout(() => errorMessage(""), 5000)
  }
}

const errorMessage = (message) =>
  (document.getElementById("errorMessage").textContent = message)

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
  errorMessage("")
  renderIPv4(document.getElementById("inputCIDR").value)
})
