import Ember from 'ember';

export default function unique(property) {
  var hash = {};

  this.map(function(obj) {
    if (obj[property] !== undefined) {
      if (hash[obj[property]] === undefined) {
        hash[obj[property]] = obj;
      } else {
        Ember.$.extend(true, hash[obj[property]], obj);
      }
    }
  });

  while(this.length > 0) {
    this.pop();
  }

  Object.keys(hash).map(function(key) {
    this.push(hash[key]);
  }, this);

  return this;
}