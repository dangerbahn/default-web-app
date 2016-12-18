import config from '../config';
import Api from './application';

if (typeof config.apis.api === 'undefined') {
  throw "Error: api API not defined in config file. Try running `grunt init`";
}

/**
 * Makes requests to http://api.target.com
 * 
 * @module apis
 * @main   apis
 * @class  api
 */
export default Api.extend({
  key: config.apis.api.key,
  host: config.apis.api.host,
  namespace: config.apis.api.namespace,
  dataType: config.apis.api.dataType,
  errorHandlers: {}
});