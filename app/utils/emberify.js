import Ember from 'ember';

var emberify = function(obj) {
  if (Ember.isArray(obj)) {
    return Ember.A(obj.map(function(val) {
      return emberify(val);
    }));
  } else if (obj !== null && typeof obj === 'object') {
    obj = Ember.Object.create(obj);
    Object.keys(obj).forEach(function(key) {
      obj.set(key, emberify(obj.get(key)));
    });

  }
  return obj;
};

export default emberify;
