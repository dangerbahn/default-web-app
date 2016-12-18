/*
  https://github.com/emberjs/ember.js/blob/v1.12.0/packages/ember-routing/lib/location/util.js
*/
export default function supportsHistory() {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf('Android 2') !== -1 &&
      userAgent.indexOf('Mobile Safari') !== -1 &&
      userAgent.indexOf('Chrome') === -1) {
    return false;
  }

  return !!(window.history && 'pushState' in window.history);
}