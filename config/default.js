// Default configuration

module.exports = {

  registry: {
    port: 9090,
  },
  
  server: {
    port: process.env.PORT || 8080,
  },
  
  api: {
    port: 4000,
  },
  
};
