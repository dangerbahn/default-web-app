import config from '../config';
import Api from './application';

if (typeof config.apis.<%= camelizedModuleName %> === 'undefined') {
  throw "Error: <%= camelizedModuleName %> API not defined in config file. Try running `grunt init`";
}

/**
 * <%= camelizedModuleName %> API
 * 
 * @module apis
 * @main   apis
 * @class  <%= camelizedModuleName %>
 */
export default Api.extend({
  key: config.apis.<%= camelizedModuleName %>.key,
  host: config.apis.<%= camelizedModuleName %>.host,
  namespace: config.apis.<%= camelizedModuleName %>.namespace,
  dataType: config.apis.<%= camelizedModuleName %>.dataType,
  errorHandlers: {}
});