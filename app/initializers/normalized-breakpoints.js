import Ember from 'ember';
import mq from '../utils/media-query-property';
import config from '../config';

/**
 * Injects [media query properties](../classes/media-query-property.html) for
 * our normalized breakpoints into components and controllers.
 *
 * Each breakpoint has 5 associated properties. For example, the small (600px)
 * breakpoint has the following properties available:
 *
 * - `ltSmall` (max-width: 599px)
 * - `lteSmall` (max-width: 600px)
 * - `isSmall` (min-width: 480px) and (max-width:599px) [where 480px is the previous breakpoint]
 * - `gteSmall` (min-width: 600px)
 * - `gtSmall` (min-width: 601px)
 *
 * By default, we inject these properties for four specific breakpoints,
 * corresponding to the breakpoints in our grid system:
 *
 * - extraSmall
 * - small
 * - medium
 * - Large
 *
 * You can access these properties in templates using the `mq` property:
 *
 * ```
 * {{#if mq.isSmall}}
 *   <p>I am small!</p>
 * {{else}}
 *   <p>I am NOT small!</p>
 * {{/if}}
 * ```
 *
 * @module  initializers
 * @class normalized-breakpoints
 * @param  {[type]} container   [description]
 * @param  {[type]} application [description]
 * @return {[type]}             [description]
 */
export function initialize(application) {

  var breakpoints = Ember.Object.create(breakpoints);
  var nameMap = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'ExtraLarge'
  };
  breakpoints.beginPropertyChanges();
  Object.keys(config.mq).forEach(function(key, index, keys) {
    var lastNum;
    var px = config.mq[key];
    var num = parseInt(px, 10);
    var prop = nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1);

    breakpoints['lt' + prop]  = mq("(max-width: " + (num - 1) + "px)");
    breakpoints['lte' + prop] = mq("(max-width: " + px + ")");
    breakpoints['gte' + prop] = mq("(min-width: " + px + ")");
    breakpoints['gt' + prop]  = mq("(min-width: " + (num + 1) + "px)");

    if (index === 0) {
      breakpoints['is' + prop] = mq("(max-width: " + (num - 1) + "px)");
    } else {
      lastNum = parseInt(config.mq[keys[index-1]], 10);
      breakpoints['is' + prop] = mq("(min-width: " + lastNum + "px) and (max-width: " + (num - 1) + "px)");
    }

  });
  breakpoints.endPropertyChanges();

  application.register('normalized-breakpoints:main', breakpoints, { instantiate: false });
  application.inject('component', 'mq', 'normalized-breakpoints:main');
  application.inject('controller', 'mq', 'normalized-breakpoints:main');

}

export default {
  name: 'normalized-breakpoints',
  initialize: initialize
};
