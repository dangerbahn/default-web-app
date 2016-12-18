import Ember from 'ember';

var keys = Object.keys;
var $ = Ember.$;

// sets a nested property on an object
var resursiveSet = function(obj, keyParts, value) {
  var prop = keyParts.shift();
  if (prop === undefined) {
    if (obj === undefined || keys(obj).length === 0) {
      return value;
    }
    if (Array.isArray(obj)) {
      obj.push(value);
      return obj;
    }
    return [obj, value];
  }
  prop = (parseInt(prop) + '' === prop) ? parseInt(prop) : prop;
  if (prop === '') {
    obj = Array.isArray(obj) ? obj : [];
    obj.push(resursiveSet({}, keyParts, value));
  } else {
    obj[prop] = obj.hasOwnProperty(prop) ? obj[prop] : {};
    obj[prop] = resursiveSet(obj[prop], keyParts, value);
  }
  return obj;
};

// parses query parameters into an object
var parseQueryParams = function(search) {
  var query = {};

  // parse query parameters
  if (search.length > 0) {
    if (search[0] === '?') {
      search = search.substring(1);
    }
    search = search.split('&').map(function(val) {
      val = val.split('=');
      return {
        name: val.shift(),
        value: val.join('=')
      };
    });
    search.forEach(function(param) {
      // handle parameter names like foo[] and foo[bar]
      var parts = param.name.split('][');
      var rootParts = parts.shift().split('[');
      [parts,rootParts].forEach(function(partsArray) {
        if (partsArray.length > 0) {
          partsArray.push(partsArray.pop().replace(/]$/, ''));
        }
      });
      parts = rootParts.concat(parts);
      resursiveSet(query, parts, param.value);
    });
  }  
  return query;
};

/**
 * @module utils
 * @class parseUrl-util
 * @param  {String} url
 * @return {Object}
 */
var parseUrl = function(url) {
  var a, path;

  a = document.createElement("a");
  a.href = url;
  path = a.pathname.split('/');
  if (path[0] === '') {
    path.shift();
  }

  return {
    host: a.host,
    hostname: a.hostname,
    href: a.href,
    url: a.href,
    port: a.port,
    pathname: a.pathname,
    path: path,
    search: a.search,
    query: parseQueryParams(a.search),
    protocol: a.protocol,
    hash: a.hash,
    password: a.password,
    username: a.username,
    build: function(includeDomain) {
      var string = '';
      if (includeDomain) {
        string += this.protocol + '//' + this.host;
      }
      if (this.pathname.length > 0) {
        if (this.path[0] !== '') {
          path.unshift('');
        }
        string += this.path.join('/');
      }
      if (keys(this.query).length > 0) {
        string += '?' + decodeURIComponent($.param(this.query));
      }
      return string + this.hash;
    }
  };
};

export default parseUrl;
