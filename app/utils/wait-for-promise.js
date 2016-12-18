import DS from 'ember-data';
import Ember from 'ember';

/**
 *
 * This method returns a promise object that resolves to the value passed in to 
 * `resolvedValue` when the provided `promise` object resolves.
 * 
 * @module utils
 * @class waitForPromise-util
 * @param  {Promise} promise
 * @param  {Mixed} resolvedValue
 * @return {Object} 
 */
export default function waitForPromise(promise, resolvedValue) {
  return DS.PromiseObject.create({
    promise: new Ember.RSVP.Promise(function(resolve) {
      var returnResolvedValue = function() {
        if (Ember.$.isFunction(resolvedValue)) {
          resolvedValue = resolvedValue();
        }
        if (!resolvedValue) {
          resolve();
        } else if (resolvedValue.then) {
          resolvedValue.then(function(value) {
            resolve(value);
          });
        } else {
          resolve(resolvedValue);
        }
      };
      if (promise && promise.then !== undefined) {
        promise.then(returnResolvedValue);
        promise.catch(returnResolvedValue);
      } else {
        returnResolvedValue();
      }
    })
  });
}
