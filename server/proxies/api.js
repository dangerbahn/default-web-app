var proxyPath = '/api';

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({
    // allow self-signed certificates
    secure: false
  });

  app.use(proxyPath, function(req, res, next){
    proxy.web(req, res, {
      target: 'http://some-api.herokuapp.com',
      changeOrigin: true
    });
  });
};
