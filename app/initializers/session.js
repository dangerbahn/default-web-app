import Ember from 'ember';
import parseUrl from '../utils/parse-url';
import storage from '../utils/localstorage';

/**
 * This initializer injects a
 * [Session Controller](../classes/session-controller.html) into all
 * components, adapters, serializers, routes, and controllers.
 *
 * By listening to the `urlchange` event triggered by the
 * [History Initializer](../classes/history-initializer.html), it
 * can keep track of the last page visited on the site.
 *
 * @module initializers
 * @class session-initializer
 */
export function initialize(application) {

  var referrer = parseUrl(document.referrer);
  var session = new Ember.Object();
  var properties = [
    'accessToken',
    'refreshToken',
    'lastPage',
    'currentPage'
  ];

  properties.forEach(function(prop) {
    var val = storage.getItem(prop);
    if (val) {
      // initialize properties from localstorage
      session.set(prop, val);
    }
    // initialize observers
    session.addObserver(prop, function() {
      var val = session.get(prop);
      if (val === undefined) {
        storage.removeItem(prop);
      } else {
        storage.setItem(prop, val);
      }
    });
  });

  // initialize lastPage and currentPage
  if (application.on !== undefined) {
    application.on('ready', function() {
      if (!session.get('lastPage') && referrer.host === document.location.host) {
        session.set('lastPage', document.referrer);
      }
      session.set('currentPage', document.location.href);
    });
  }

  // watch for url change
  Ember.$(window).on('urlchange', function(event, from, to) {
    session.set('lastPage', from);
    session.set('currentPage', to);
  });

  application.register('session:main', session, {instantiate: false});
  application.inject('route', 'session', 'session:main');
  application.inject('service', 'session', 'session:main');

}

export default {
  name: 'session',
  initialize: initialize
};
