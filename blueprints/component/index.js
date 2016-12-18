/*jshint node:true*/

var Blueprint   = require('../../node_modules/ember-cli/lib/models/blueprint');
var SilentError = require('../../node_modules/ember-cli/lib/errors/silent');

var path        = require('path');

module.exports = {
  description: 'Generates a component with template & stylesheet. Name must contain a hyphen.',

  availableOptions: [
    {
      name: 'path',
      type: String,
      default: 'components',
      aliases:[
        {'no-path': ''}
      ]
    }
  ],

  fileMapTokens: function() {
    return {
      __path__: function(options) {
        if (!options.locals.path) {
          options.locals.path = 'components';
        }
        return path.join(options.locals.path, options.dasherizedModuleName);
      },
      __name__: function(options) {
        return "component";
      },
      __templatename__: function(options) {
        return "template";
      },
      __scssname__: function(options) {
        return "stylesheet";
      }
    };
  },

  normalizeEntityName: function(entityName) {
    entityName = Blueprint.prototype.normalizeEntityName.apply(this, arguments);

    if(! /\-/.test(entityName)) {
      throw new SilentError('You specified "' + entityName + '", but in order to prevent ' +
                            'clashes with current or future HTML element names, you must include ' +
                            'a hyphen in the component name.');
    }

    return entityName;
  },

  locals: function(options) {
    var templatePath   = '';
    var contents       = '';
    var className      = '';

    var rawName = options.entity.name;
    if (rawName.indexOf('/') !== "-1") {
      rawName = rawName.split('/');
      rawName = rawName[rawName.length - 1];
    }

    className = rawName.replace( (/(\-|_|\.|\s)+(.)?/g), function(match, separator, chr) {
      return chr ? chr.toUpperCase() : '';
    }).replace(/^([A-Z])/, function(match) {
      return match.toLowerCase();
    });

    return {
      contents: contents,
      path: options.path,
      className: className,
      rawName: rawName
    };
  }
};

function getPathLevel(name) {
  return new Array(name.split('/').length + 1).join('../');
}
