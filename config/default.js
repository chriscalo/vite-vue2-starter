// Default configuration

module.exports = {

  registry: {
    port: 9090,
  },
  
  server: {
    port: process.env.PORT || 8080,
  },
  
  ui: {
    port: 3000,
  },
  
  api: {
    port: 4000,
  },
  
};
