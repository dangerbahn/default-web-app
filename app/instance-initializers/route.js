import Ember from 'ember';

const { getOwner } = Ember;

export function initialize(/* container, application */) {
  Ember.Route.reopen({
    getViewsByAlias: function(alias) {
      var views = getOwner(this).lookup('-view-registry:main');
      return Object.keys(views).filter(function(key) {
        var view = views[key];
        var matches = view.viewAlias === alias;
        var isDestroyed = (view.isDestroyed || view.isDestroying);
        return matches && !isDestroyed;
      }).map(function(key) {
        return views[key];
      });
    },
    getViewByAlias: function(alias) {
      return this.getViewsByAlias(alias).slice().shift();
    }
  });
}

export default {
  name: 'route',
  initialize: initialize
};
