/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    SRI: {
      enabled: false
    },
    sassOptions: {
      includePaths: [
        'app/components',
        'app/styles'
      ]
    },
    vendorFiles: {
      'handlebars.js': null
    },
    fingerprint: {
      enabled: false
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/modernizr.custom.js');
  // app.import('vendor/hammer.min.js');
  app.import('vendor/fabric.js');
  app.import('vendor/gyro.js');
  app.import('vendor/leaflet.js');
  app.import('vendor/leaflet.draw.js');
  app.import('vendor/fastclick.js');

  return app.toTree();
};
