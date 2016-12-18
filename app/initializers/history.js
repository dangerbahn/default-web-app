import Ember from 'ember';
import supportsHistory from '../utils/supports-history';
import supportsHashChange from '../utils/supports-hash-change';

/**
 * This initializer adds a `urlchange` event to the `window` object that other
 * objects can listen to. Used in the
 * [Session Initializer](../classes/session-initializer.html)
 *
 * @module initializers
 * @class history-initializer
 */
export function initialize() {

  var lastPage = document.referrer,
    currentPage = document.location.href,
    $window = Ember.$(window),
    triggerUrlChange = function() {
      $window.trigger('urlchange', [lastPage, currentPage]);
    };
  if (supportsHistory()) {
    (function() {
      var pushState = window.history.pushState;
      window.history.pushState = function() {
        var ret;
        lastPage = window.location.href;
        ret = pushState.apply(this, arguments);
        currentPage = window.location.href;
        triggerUrlChange();
        return ret;
      };
    }());
    $window.on('popstate', function() {
      lastPage = currentPage;
      currentPage = window.location.href;
      triggerUrlChange();
    });
  } else if (supportsHashChange()) {
    $window.on('hashchange', function() {
      lastPage = currentPage;
      currentPage = window.location.href;
      triggerUrlChange();
    });
  }
}

export default {
  name: 'history',
  before: 'session',
  initialize: initialize
};
