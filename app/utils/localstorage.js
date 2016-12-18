import cookieStorage from './cookies';

var storageHelper = {
  localStorageSupported: function() {
    var test = 'supportTest';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  },
  sessionStorageSupported: function() {
    var test = 'supportTest';
    try {
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  },
  getStorage: function() {
    var storage;
    var storageWrapper = {
      getItemAsObj: function(key) {
        var string = storage.getItem(key);
        try {
          return JSON.parse(string);
        } catch(e) {
          return false;
        }
      },
      setItem: function(key, value) {
        if (typeof value !== "string") {
          value = JSON.stringify(value);
        }
        return storage.setItem(key, value);
      }
    };

    if (this.localStorageSupported()) {
      storage = localStorage;
    } else if (this.sessionStorageSupported()) {
      storage = sessionStorage;
    } else {
      storage = cookieStorage;
    }

    ['getItem', 'removeItem', 'clear'].forEach(function(method) {
      storageWrapper[method] = function() {
        return storage[method].apply(storage, arguments);
      };
    });

    return storageWrapper;
  },
};

export default storageHelper.getStorage();
