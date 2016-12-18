/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'default-ember-app',
    environment: environment,
    rootURL: '/',
    defaultLocationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.contentSecurityPolicy = {
     'default-src': "'none'",
     'script-src': "'self' 'unsafe-eval' 'unsafe-inline' http://localhost:5000",
     'font-src': "'self'",
     'connect-src': "'self' ws://localhost:4080 http://localhost:5000",
     'img-src': "'self' data: http://localhost:4200",
     'style-src': "'self' 'unsafe-inline'",
     'media-src': "'self'",
     'report-uri': 'http://localhost:4200/csp-report',
     'frame-src': "http://www.google.com",
     'object-src': ""
   };

  return ENV;
};
