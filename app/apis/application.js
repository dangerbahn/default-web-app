import Ember from 'ember';
import parseUrl from '../utils/parse-url';
import clone from '../utils/clone';

/**
 * Classes that extend the application-api class allow for API-level
 * abstractions to be made for AJAX services.
 *
 * New APIs can be generated via a blueprint by running:
 *
 * ```
 * ember generate api <name>
 * ```
 *
 * Be careful not to confuse APIs with [Services](./services.html), which
 * provide a different level of abstraction.
 *
 * @module apis
 * @main  apis
 * @class  application-api
 */
var wrap = function(httpMethod) {
  return function(url, data, settings) {
    settings = settings || {};
    settings.method = httpMethod;
    return this.request(url, data, settings);
  };
};

export default Ember.Object.extend({
  /**
   * If provided, the 'key' property will be added as a GET parameter to every
   * request.
   *
   * @property key
   * @type {String}
   * @example
   *   hdy7dhdeyfhdfy7fhdydsh12x
   */
  key: undefined,
  /**
   * The base url for the API. If undefined, this will take the value of the
   * current page's host.
   *
   * @property host
   * @type {String}
   * @example
   *   http://api.target.com
   */
  host: undefined,
  /**
   * Namespace for the API. If given, this will be added as the base path for
   * each request. This property is particularly helpful when proxying requests
   * through a local server to avoid CORS errors.
   *
   * @property namespace
   * @type {String}
   * @example
   *   api-proxy
   */
  namespace: undefined,
  /**
   * The default dataType to be used in ajax requests.
   *
   * @property dataType
   * @type {String}
   * @example
   *   jsonp
   */
  dataType: undefined,
  /**
   * The collection of functions, keyed by name, available to handle rejected
   * promises returned by the ajax request.
   *
   * For example, if we wanted to alert "Internal Server Error" every time
   * an ajax request returned with a HTTP 500 status code, we could do so by
   * defining an appropriate `errorHander` function:
   *
   * ```
   * import Ember from 'ember';
   * import Api from './application';
   *
   * export default Api.extend({
   *   ...
   *   errorHandlers: {
   *     internalServerError: function(reason, url, settings, resolve, reject) {
   *       if (reason.status === 500) {
   *         alert("Internal Server Error");
   *       }
   *       reject(reason);
   *       return false;
   *     }
   *   }
   *   ...
   * });
   * ```
   *
   * If we wanted to catch a particular error and cause the promise to be
   * resolved rather than rejected, we could do that by using the `resolve`
   * parameter passed in to the error handler:
   *
   * ```
   * import Ember from 'ember';
   * import Api from './application';
   *
   * export default Api.extend({
   *   ...
   *   errorHandlers: {
   *     sessionTimeout: function(reason, url, settings, resolve, reject) {
   *       if (reason.errorKey === "SESSION_TIMEOUT") {
   *         // note: resfreshSession is not a real method
   *         refreshSession().then(function() {
   *           return Ember.$.ajax(url, settings);
   *         }).then(function(data) {
   *           resolve(data);
   *         });
   *         return true;
   *       }
   *       reject(reason);
   *       return false;
   *     }
   *   }
   *   ...
   * });
   * ```
   *
   * @property errorHandlers
   * @type {Object}
   */
  errorHandlers: {},
  /**
   * @method prepareUrl
   * @param  {String} url
   * @return {String}
   */
  prepareUrl: function(url /*, settings*/) {
    var host;
    url = parseUrl(url);

    if (Ember.get(this, 'host')) {
      host = parseUrl(Ember.get(this, 'host'));
      url.protocol = host.protocol;
      url.host = host.host;
    }

    if (Ember.get(this, 'namespace')) {
      url.path.unshift(Ember.get(this, 'namespace'));
    }

    if (Ember.get(this, 'key')) {
      url.query.key = Ember.get(this, 'key');
    }

    return url.build(!!Ember.get(this, 'host'));
  },
  /**
   * @method prepareSettings
   * @param  {String} url
   * @param  {Object} settings
   * @return {Promise}
   */
  prepareSettings: function(url, settings) {
    var defaultSettings = {
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (Ember.get(this, 'dataType')) {
      settings.dataType = Ember.get(this, 'dataType');
    }

    settings = Ember.$.extend({}, defaultSettings, settings);

    if (settings.data && typeof settings.data !== "string") {
      Object.keys(settings.data).forEach(function(key) {
        if (settings.data[key] === undefined) {
          delete settings.data[key];
        }
      });
    }

    if (settings.dataType === 'json' && settings.method !== 'GET') {
      if (typeof settings.data !== "string") {
        settings.data = JSON.stringify(settings.data);
        if (settings.data === '{}') {
          delete settings.data;
        }
      }
    }

    if (settings.accessToken) {
      if (settings.accessToken.then) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          settings.accessToken.then(
            function(val) {
              settings.accessToken = val;
              settings.headers['Authorization'] = 'Bearer ' + val;
              resolve(settings);
            },
            reject
          );
        });
      }
      settings.headers['Authorization'] = 'Bearer ' + settings.accessToken;
    }

    return new Ember.RSVP.Promise(function(resolve) {
      resolve(settings);
    });

  },
  /**
   * @method request
   * @param  {String} url
   * @param  {Object} data
   * @param  {Object} settings
   * @return {Promise}
   */
  request: function(url, data, settings) {
    var originalSettings;
    var originalUrl;
    var self = this;

    settings = settings || {};
    settings.method = settings.method || 'GET';
    settings.data = data;

    originalUrl = clone(url);
    originalSettings = clone(settings);

    url = this.prepareUrl(url, settings);
    settings = this.prepareSettings(url, settings);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      settings.catch(reject);
      settings.then(function(resolvedSettings) {
        var ajaxPromiseReject = function(reason) {
          var errorHandlers = Ember.get(self, 'errorHandlers') || {};
          var notResolved = Object.keys(errorHandlers).every(function(key) {
            return !errorHandlers[key].call(self, reason, originalUrl, resolvedSettings, resolve, reject);
          });
          if (notResolved) {
            reject(reason);
          }
        };
        Ember.$.ajax(url, resolvedSettings).then(resolve, ajaxPromiseReject);
      });
    });

  },
  /**
   * @method get
   * @param  {String} url
   * @param  {Object} data
   * @param  {Object} settings
   * @return {Promise}
   */
  get: wrap('GET'),
  /**
   * @method post
   * @param  {String} url
   * @param  {Object} data
   * @param  {Object} settings
   * @return {Promise}
   */
  post: wrap('POST'),
  /**
   * @method put
   * @param  {String} url
   * @param  {Object} data
   * @param  {Object} settings
   * @return {Promise}
   */
  put: wrap('PUT'),
  /**
   * @method delete
   * @param  {String} url
   * @param  {Object} data
   * @param  {Object} settings
   * @return {Promise}
   */
  delete: wrap('DELETE'),
});
