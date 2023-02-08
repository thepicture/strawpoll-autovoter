const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const PROXIES_URL =
  "https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc&protocols=http";

class Proxy {
  async getFreeProxy() {
    const response = await fetch(PROXIES_URL);

    const { data: proxies } = await response.json();

    const { ip, port } = proxies[Math.floor(Math.random() * proxies.length)];

    return {
      server: `http://${ip}:${port}`,
    };
  }
}

module.exports = {
  Proxy,
};
