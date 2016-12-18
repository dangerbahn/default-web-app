import Ember from 'ember';
import hashCode from './hash-code';

/**
 * This util lets you define boolean properties on views and components by
 * passing in a media query. For example, if you had a 'blog-post' component,
 * you could have the following in `components/blog-post.js`
 *
 * ```JavaScript
 * import Ember from 'ember';
 * import mq from '../utils/media-query-property';
 * 
 * export default Ember.Component.extend({
 *   showSidebar: mq("(min-width: 800px)")
 * });
 * ```
 *
 * And the following in `templates/components/blog-post.hbs`
 *
 * ```
 * <div class"blogPost">
 *   <h1>{{title}}</h1>
 *   <p>{{author}}</p>
 *   {{content}}
 *   {{#if showSidebar}}
 *     {{sidebar blogPost=model}}
 *   {{/if}}
 * </div>
 * ```
 *
 * Then the `sidebar` component would only be rendered if the browser was 800px
 * or wider.
 *
 * Media queries are testes using 
 * [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia),
 * and will always return false in browsers where the matchMedia API is 
 * unsupported, similar to how css properties inside media queries blocks are 
 * not applied when css media queries are not supported.
 *
 * Multiple properties using the same media query (based on comparing them as a 
 * string) will not result in multiple calls to window.matchMedia, and the method
 * that tests the media queries is throttled to run only once every 150 
 * milliseconds on window.resize.
 *
 * Media query properties for normalized breakpoints are injected into all
 * controllers and components. See the documentation for the 
 * [normalized breakpoint initializer](../classes/normalized-breakpoints.html)
 * for more details.
 *
 * @module  utils
 * @class  media-query-property
 */

var mediaQueryWatcher = Ember.Object.create({
  isInitialized: false,
  mediaQueries: {},
  addQuery: function(mediaQueryString, hash) {
    // only bind window.resize once a query is added
    if (!this.get('isInitialized')) {
      this.init();
    }
    return this.check(mediaQueryString, hash);
  },
  check: function(mediaQueryString, hash) {
    var isMatch;
    var didMatch;
    hash = hash || hashCode(mediaQueryString);
    isMatch = this.matchMedia(mediaQueryString);
    didMatch = Ember.get(this, 'mediaQueries.' + hash + '.matches');
    if (didMatch === undefined) {
      this.set('mediaQueries.' + hash, {
        query: mediaQueryString,
        matches: isMatch
      });
    } else if (isMatch !== didMatch) {
      this.set('mediaQueries.' + hash + '.matches', isMatch);
    }
    return isMatch;
  },
  matchMedia: function(mediaQueryString) {
    if (window && window.matchMedia) {
      return window.matchMedia(mediaQueryString).matches;
    }
    return false;
  },
  init: function() {
    var self = this;
    if (window) {
      window.onresize = function() {
        Ember.run.throttle(undefined, function() {
          var mediaQueries = self.get('mediaQueries');
          var keys = Object.keys(mediaQueries);
          keys.forEach(function(hash) {
            self.check(mediaQueries[hash].query);
          });
        }, 150);
      };
    }
    this.set('isInitialized', true);
  }
});

export default function mediaQueryProperty(mediaQueryString) {
  var hash = hashCode(mediaQueryString);
  if (typeof mediaQueryString === "string") {
    mediaQueryWatcher.addQuery(mediaQueryString, hash);
  }
  return Ember.computed('_mq.mediaQueries.' + hash + '.matches', function() {
    if (!this.get('_mq')) {
      this.set('_mq', mediaQueryWatcher);
    }
    return this.get('_mq.mediaQueries.' + hash + '.matches');
  });
}
