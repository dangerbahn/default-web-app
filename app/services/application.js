import Ember from 'ember';
import api from '../apis/api';

const { getOwner } = Ember;

/**
 * Services provide another level of abstraction to particular [APIs](./apis.html).
 *
 * While [APIs](./apis.html) abstract the ways to connect and make requests to a
 * particular host, Services are more defined by *what* they request, rather than
 * *where* they request it from. For example,
 * [target's enterprise services](http://dev.target.com/api-documentation)
 * consist of 2 APIs (api.target.com and secure-api.target.com), split into many
 * different services (e.g. carts v2, guests v3, etc).
 *
 * Services have access to multiple APIs, so different methods within a service
 * may query completely different APIs. For example, the products Service in Kona
 * queries both the enterprise apis (api.target.com), and the tws search service
 * (tws.target.com).
 *
 * @module services
 * @main  services
 * @class  application-service
 */
export default Ember.Service.extend({
  init: function() {
    this._super.apply(this, arguments);
    this.apis = {
      api: api.create({container: getOwner(this)})
    };
  },
  /**
   * Takes in data (or a promise) as the first argument, and a method
   * to transform that data as the second argument. If an object is passed in,
   * this method will return the result of the transformation on the data.
   * If a promise is passed in, this method will return a promise that resolves
   * with the transformed data.
   *
   * @mthod normalize
   * @param  {Promise|Object} data
   * @param  {Function} normalizeMethod
   * @return {Promise|Object}
   */
  normalize: function(data, normalizeMethod) {
    var self = this;
    if (data.then) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        data.then(function(value) {
          resolve(normalizeMethod.call(self, value));
        });
        data.catch(reject);
      });
    }
    return normalizeMethod.call(self, data);
  }
});
