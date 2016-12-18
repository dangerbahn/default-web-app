import Ember from 'ember';

var isInt = function(val) {
  return (parseInt(val) === val);
};

/**
 * Combine an array of arrays into a single array
 *
 * ```JavaScript
 * combine([['a','b','c'],['d','e','f'],['g','h','i']]);
 * // returns ['a','b','c','d','e','f','g','h','i']
 * ```
 */
var combine = function(array) {
  var ret = [];
  array.map(function(val) {
    if (val !== undefined) {
      ret = ret.concat(val);
    }
  });
  return ret;
};

var keyPathToArray = function(keyPath) {
  if (Ember.typeOf(keyPath) === 'string') {
    return keyPath.split('.');
  }
  keyPath = keyPath || [];
  return keyPath.concat([]);
};

var getHelper = function(obj, keyPath, currentKeyPath) {
  var key,
    root = obj,
    recursiveGet;

  // it's better to define this function outside of the loop
  recursiveGet = function(val, index) {
    var innerKeypath = currentKeyPath.concat([index, key]);
    return getHelper(val[key], keyPath, innerKeypath);
  };

  keyPath = keyPathToArray(keyPath);
  currentKeyPath = keyPathToArray(currentKeyPath);

  while (keyPath.length > 0) {
    key = keyPath.shift();
    if (key !== '@each' && key !== '@this' && key !== '' && key !== '@root') {
      if (!isInt(key) && Ember.isArray(root)) {
        var tmp = root.map(recursiveGet);
        return combine(tmp);
      }
      if (isInt(key)) {
        key = parseInt(key);
      }
      if (root !== undefined) {
        root = root[key];
      }
      currentKeyPath.push(key);
    }
  }

  if (Ember.isArray(root)) {
    root.map(function(val, index) {
      try {
        val._keyPath = currentKeyPath.join('.') + '.' + index;
      } catch(e) {
        if (e.message.indexOf('Cannot assign to read only property') === -1) {
          throw e;
        }
      }
    });
  } else if (root !== undefined) {
    try {
      root._keyPath = currentKeyPath.join('.');
    } catch(e) {
      if (e.message.indexOf('Cannot assign to read only property') === -1) {
        throw e;
      }
    }
  }

  return root;
};

export default function get(obj, keyPath) {
  return getHelper(obj, keyPath);
}