/* global t2Proto */
import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingNav: true,
  isRoot: true,
  init: function() {
    var emberObj = Ember.Object.extend({});
    var appInterfaceData = emberObj.create({
      "nativeValue": undefined
    });
    this.set('appData', appInterfaceData);
    this.pollLocationData();
  },
  pollLocationData: function () {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return false;
    }
    var data = this.get('appData');
    var self = this;
    Object.keys(data).forEach(function(key) {
      var val = data[key];
      var updatedVal = appInterface.get(key);
      if (val !== updatedVal) {
        self.set('appData.'+key, updatedVal)
        self.notifyPropertyChange('appData.'+key)
      }
    });
    var timeout = Ember.run.later(this, 'pollLocationData', 100);
    this.set('pollingTimeout', timeout);
  }
});
