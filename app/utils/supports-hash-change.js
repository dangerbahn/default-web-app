/*
  https://github.com/emberjs/ember.js/blob/v1.12.0/packages/ember-routing/lib/location/util.js
*/
export default function supportsHashChange() {
  return ('onhashchange' in window) && (document.documentMode === undefined || document.documentMode > 7);
}