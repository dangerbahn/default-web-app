import Ember from 'ember';
import animate from '../../../utils/animate';
import layout from './template';

const { getOwner } = Ember;

var Promise = window.Promise;

/**
 * @module  components
 * @class   tgt-modal
 */
export default Ember.Component.extend({
  layout: layout,
  classNames: ['basicModal'],
  classNameBindings: ['isTallerThanViewport:basicModal-tall'],
  attributeBindings: ['isHidden:aria-hidden'],
  ariaRole: "dialog",
  animationTime: 250,
  isOpen: false,
  _previousFocus: null,
  _focusDisabledElements: [],
  isHidden: Ember.computed('isOpen', function() {
    return !this.get('isOpen');
  }),

  /**
   * remove the modal from the DOM
   * @method didInsertElement
   */
  didInsertElement: function() {
    Ember.$(this.element).detach();
  },

  /**
   * Adds some event listeners
   * @method didOpen
   */
  didOpen: function() {

    var self = this;

    Ember.$('body').on('click touchend', '#overlay', function(e) {
      e.stopPropagation();
      e.preventDefault();
      Ember.run.once(function() {
        self.send('close');
      });
    });

    // Close the modal when the escape key is pressed
    Ember.$('body').on('keyup', self._handleKeyUp);

    self.set('isOpen', true);

    if (self.get('open')) {
      self.sendAction('open');
    }

  },

  /**
   * Removes event listeners
   * @method didClose
   */
  didClose: function() {
    Ember.$('body').off('click touchend', '#overlay');
    Ember.$('body').off('keyup', this._handleKeyUp);
    this.set('isOpen', false);
    if (this.get('close')) {
      this.sendAction('close');
    }
    this.dispatchAction('closeModalHook')
  },

  /**
   * close the modal if the 'esc' key is pressed
   *
   * @method _handleKeyUp
   * @param  {Event} e
   */
  _handleKeyUp: function(e) {
    if (e.keyCode === 27) {
      Ember.$(this).find('.basicModal--closeButton').first().click();
    }
  },

  /**
   * Disables focus on all elements not instide the modal.
   *
   * @method _disableFocus
   */
  _disableFocus: function() {

    var focusableSelector     = 'a,input,select,textarea,button,[tabIndex]';
    var $focusable            = Ember.$(focusableSelector);
    var $focusableInModal     = this.$(focusableSelector);
    var $focusableNotInModal  = $focusable.not($focusableInModal);
    var focusDisabledElements = this.get('_focusDisabledElements');

    $focusableNotInModal.each(function() {
      var $element = Ember.$(this);
      var tabIndex = $element.attr('tabIndex');
      $element.attr('tabIndex', -1);
      focusDisabledElements.push({
        element: $element,
        tabIndex: tabIndex
      });
    });

    this.set('_focusDisabledElements', focusDisabledElements);

    Ember.$('body > .ember-view:not(.basicModal)').on('focusin', function() {
      Ember.$('.basicModal h2').focus();
    });

    Ember.$('body > .ember-view').first().attr('aria-hidden', true);

  },

  /**
   * Re-enables focus on elements disabled by `_disableFocus`
   *
   * @method _enableFocus
   */
  _enableFocus: function() {

    var focusDisabledElements = this.get('_focusDisabledElements');

    focusDisabledElements.forEach(function(el) {
      if (el.tabIndex !== undefined) {
        el.element.attr('tabIndex', el.tabIndex);
      } else {
        el.element.removeAttr('tabIndex');
      }
    });

    this.set('_focusDisabledElements', []);

    Ember.$('body > .ember-view:not(.basicModal)').off('focusin');
    Ember.$('body > .ember-view').first().removeAttr('aria-hidden');

  },

  /**
   * @method _closeOpenModals
   * @return {Promise}
   */
  _closeOpenModals: function() {

    var self = this;
    var views = getOwner(this).lookup('-view-registry:main');

    var modals = Object.keys(views)
      .filter(function(key) {
        var isSelf = views[key] === self;
        var isModal = Ember.$(views[key].element).hasClass('basicModal');
        var isOpen = Ember.get(views[key], 'isOpen');
        return isModal && !isSelf && isOpen;
      })
      .map(function(key) {
        return views[key];
      });

    if (modals.length > 0) {
      return Promise.all(
        modals.map(function(modal) {
          modal.send('close');
          return new Promise(function(resolve) {
            Ember.run.later(function() {
              resolve();
            }, modal.get('animationTime'));
          });
        })
      );
    }

    return Promise.resolve();

  },

  /**
   * @method _setupModalViewport
   */
  _setupModalViewport: function() {

    var $this = Ember.$(this.element);
    var viewportHeight = window.innerHeight;
    var containerHeight = $this.height() || 0;

    if (containerHeight > viewportHeight) {
      this.set('isTallerThanViewport', true);
      $this.addClass('basicModal-tall');
      $this.css('top', Ember.$(window).scrollTop() + 16);
    } else {
      this.set('isTallerThanViewport', false);
      $this.css('top', '50%');
    }

  },

  actions: {

    open: function() {
      var self = this;

      self._closeOpenModals().then(function() {

        var $overlay = Ember.$('#overlay');
        var animationTime = self.get('animationTime');

        // add an overlay div, if one doesn't already exist
        if ($overlay.length === 0) {
          $overlay = Ember.$('<div id="overlay" class="basicModal--overlay">');
          Ember.$('body').append($overlay);
        }
        $overlay.click(function(){
          self.send('close')
        })

        // move the modal <div> so that it's a direct child of the <body> tag
        Ember.$('body').append(self.element);

        self._setupModalViewport();

        // Handle the focus
        self.set('_previousFocus', document.activeElement);
        self._disableFocus();

        // Animate the modal in
        Ember.run.next(function() {
          animate($overlay, 'modal-in', animationTime);
          animate(self.element, 'modal-in', animationTime).then(function() {
            var $heading = Ember.$(self.element).find('h2');
            if (!$heading.attr('tabindex')) {
              $heading.attr('tabindex', '0');
            }
            $heading.focus();
          });
        });

        self.didOpen();

      });

    },

    close: function() {
      var self = this;
      var $overlay = Ember.$('#overlay');
      var animationTime = this.get('animationTime');
      var previousFocus = this.get('_previousFocus');

      // animate the overlay out, if it exists
      if ($overlay.length > 0) {
        animate($overlay, 'modal-out', animationTime).then(function() {
          $overlay.remove();
        });
      }
      $overlay.off()
      // animate the modal out, and then detach it from the dom
      animate(this.element, 'modal-out', animationTime).then(function() {
        Ember.$(self.element).detach();
        Ember.$(self.element).attr('class', 'basicModal');
      });

      // handle the focus
      this._enableFocus();
      if (previousFocus) {
        previousFocus.focus();
      }

      this.didClose();

    }
  }
});
