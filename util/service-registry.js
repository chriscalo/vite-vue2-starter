const seaport = require("seaport");

const DEFAULT_PORT = 9090;

class RegistryServer {
  constructor(port = DEFAULT_PORT) {
    this.port = port;
    this.server = seaport.createServer();
    this.server.listen(port);
  }
}

function start(port = DEFAULT_PORT) {
  console.log(`Starting service registry on port ${port}`);
  server = new RegistryServer(port);
}

class RegistryConnection {
  constructor(port = DEFAULT_PORT) {
    this.port = port;
    console.log(`Connecting to service registry on port ${port}`);
    this.connection = seaport.connect(port);
  }
  
  register(name, options = {}) {
    console.log(`Registering service: ${name}`, options);
    this.connection.register(name, options);
  }
  
  get(name) {
    console.log(`Awaiting service: ${name}`);
    return new Promise((resolve, reject) => {
      this.connection.get(name, resolve);
    }).then(services => {
      console.log(`Services resolved: ${name}`, services);
      return services;
    });
  }
}

function connect(port = DEFAULT_PORT) {
  return new RegistryConnection(port);
}

module.exports = {
  RegistryServer,
  start,
  RegistryConnection,
  connect,
};
