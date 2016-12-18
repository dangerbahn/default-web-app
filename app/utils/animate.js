import Ember from 'ember';

/**
 * adds three classes to an element to make css transitions
 * easier. The three classes are:
 *
 * animating-`name` - define which properties to transition here
 * animate-start-`name` - define the initial state those properties should have
 * animate-end-`name` - define the final state those properties should have
 *
 * The classes are added to the `element` property in this order:
 *
 * 0ms  - adds animate-start-`name`
 * 16ms - adds animating-`name`
 * 32ms - adds animate-end-`name` and removes animate-start-`name`
 * `time`ms - removes animating-`name` class
 *
 * @param  {Node}   element the HTML element
 * @param  {String} name    the name of the animation
 * @param  {Number} time    how long the animation should take
 * @return {Promise}
 */
export default function animate(element, name, time) {

  // this is so jshint doesn't freak out
  var Promise = window.Promise;

  return new Promise(function(resolve) {

    var classes = [
      "animate-start-" + name,
      "animate-end-" + name,
      "animating-" + name
    ];
    if (typeof(element.className) === 'undefined') {
      element = element[0];
    }    
    element.className.split(/\s+/).forEach(function(className) {
      if (className.indexOf('animat') === 0) {
        Ember.$(element).removeClass(className);
      }
    });

    Ember.$(element).addClass(classes[0]);

    Ember.run.later(function() {
      Ember.$(element).addClass(classes[2]);
    }, 16);

    Ember.run.later(function() {
      Ember.$(element).addClass(classes[1]);
      Ember.$(element).removeClass(classes[0]);
    }, 32);

    Ember.run.later(function() {
      Ember.$(element).removeClass(classes[0] + ' ' + classes[2]);
      resolve();
    }, time);

  });

}
