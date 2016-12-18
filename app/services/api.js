import Ember from 'ember';
import ApiService from './application';

/**
 * api service
 *
 * @class  api-service
 * @module  services
 */
export default ApiService.extend({
  pingAPI: function() {
    var self = this;
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var request = self.apis.api.get(
        '/',
        {}
      );
      request.then(function(value) {
        resolve(value);
      });
      request.catch(function(reason) {
        reject(reason);
      });
    });
    return this.normalize(
      promise,
      function(data) {
        return data;
      }
    );
  }
});
