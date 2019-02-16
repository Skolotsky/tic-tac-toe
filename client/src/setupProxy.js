const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api',
    {
      target: 'http://localhost:8999',
      logLevel: "debug",
    }
  ));
  app.use(proxy('/ws',
    {
      target: 'ws://localhost:8999',
      pathRewrite: {
        '^/ws': ''
      },
      ws: true,
      logLevel: "debug",
    }
  ));
};
