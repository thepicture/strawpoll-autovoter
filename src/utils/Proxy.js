const { Args, ArgTypes } = require("./Args");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const PROXIES_URL =
  "https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc&protocols=http";

class Proxy {
  async getProxy() {
    const userProxy = Args.get(ArgTypes.HTTP_PROXY);

    if (userProxy) {
      const creds = Args.get(ArgTypes.PROXY_CREDENTIALS);

      const [username, password] = creds.split(":");

      if (creds) {
        return {
          server: userProxy,
          username,
          password,
        };
      } else {
        return {
          server: userProxy,
        };
      }
    }

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
