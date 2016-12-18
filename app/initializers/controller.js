import Ember from 'ember';
export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  Ember.Controller.reopen({
    application: Ember.inject.controller()
  })
}

export default {
  name: 'controller',
  initialize
};
