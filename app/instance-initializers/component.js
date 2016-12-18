import Ember from 'ember';


export function initialize(app) {
  Ember.Component.reopen({
    dispatchAction: function() {
      var appRoute = app.lookup('route:application');
      var currentRouteName = appRoute.get('controller.currentRouteName');
      var currentRoute = app.lookup('route:' + currentRouteName);
      currentRoute.send.apply(currentRoute, arguments);
    },
    getChildViewByAlias: function(alias) {
      var self = this;
      var appRoute = app.lookup('route:application');
      var views = appRoute.getViewsByAlias(alias);
      var childView = views.filter(function(view) {
        return self.isChildOf.call(view, self);
      }).shift();
      return childView;
    },
    getParentViewByAlias: function(alias) {
      var self = this;
      var appRoute = app.lookup('route:application');
      var views = appRoute.getViewsByAlias(alias);
      return views.filter(function(view) {
        return self.isChildOf(view);
      }).shift();
    },
    isChildOf: function(parentComponent, originalComponent) {
      var parent = this.get('parentView');
      originalComponent = originalComponent || this;
      if (!parent) {
        return false;
      }
      if (parent === parentComponent) {
        return true;
      }
      return originalComponent.isChildOf.call(parent, parentComponent, originalComponent);
    },

    currentLocation: function() {
      var appRoute = app.lookup('route:application');
      var currentRouteName = appRoute.get('controller.currentRouteName');
      var currentRoute = app.lookup('route:' + currentRouteName);
      var locationData = currentRoute.get('controller.application.locationData')
      return locationData
    }.property()
  });
}

export default {
  name: 'component',
  initialize: initialize
};
