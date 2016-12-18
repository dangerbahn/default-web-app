import Ember from 'ember';
import layout from './template';

/**
 * @module  components
 * @class   tgt-input
 */
export default Ember.Component.extend({
  layout: layout,
  classNames: ['basicInput'],

  classNameBindings: [
    'hasValue:basicInput-hasValue',
    'hasFocus:basicInput-hasFocus',
    'showValid:basicInput-isValid',
    'showInvalid:basicInput-isInvalid',
  ],

  /**
   * the html input's type
   *
   * @default  "text"
   * @property {String} type
   */
  type: "text",

  /**
   * If true, input will have the `required` attribute
   *
   * @default  false
   * @property {Boolean} required
   */
  required: false,

  /**
   * whether or not the input currently has focus
   *
   * @default  false
   * @property {Boolean} hasFocus
   */
  hasFocus: false,

  /**
   * whether or not the input has been focused since it was inserted
   *
   * @default  false
   * @property {Boolean} hasBeenFocused
   */
  hasBeenFocused: false,

  /**
   * whether or not the input has been changed since it was inserted
   *
   * @default  false
   * @property {Boolean} hasBeenChanged
   */
  hasBeenChanged: false,

  /**
   * whether or not the input has lost focus since it was inserted
   *
   * @default  false
   * @property {Boolean} hasBeenBlurred
   */
  hasBeenBlurred: false,

  /**
   * whether or not the input has something entered for its value
   *
   * @default  false
   * @property {Boolean} hasValue
   */
  hasValue: Ember.computed('value', function() {
    return !!this.get('value');
  }),

  /**
   * whether or not the input has help (or error) text
   *
   * @default  false
   * @property {Boolean} hasHelpText
   */
  hasHelpText: Ember.computed('errorMessage', 'helpText', function() {
    return this.get('errorMessage') || this.get('helpText');
  }),

  /**
   * whether or not the input's value is valid. Returns 'true' before the
   * element is inserted into the DOM.
   *
   * @default  true
   * @property {Boolean} isValid
   */
  isValid: Ember.computed('value', function() {
    var $input = this.getInput();
    return $input.length > 0 ? $input.get(0).checkValidity() : true;
  }),

  /**
   * returns true if the input's type is "hidden"
   *
   * @default  false
   * @property {Boolean} isHidden
   */
  isHidden: Ember.computed('type', function() {
    return this.get('type') === "hidden";
  }),

  /**
   * whether or not the component should have an 'isValid' class applied.
   *
   * @default  false
   * @property {Boolean} showValid
   */
  showValid: Ember.computed('hasBeenFocused', 'isValid', function() {
    if (this.get('hasBeenFocused') && this.get('hasValue')) {
      return this.get('isValid');
    }
    return false;
  }),

  /**
   * whether or not the component should have an 'isInvalid' class applied.
   *
   * @default  false
   * @property {Boolean} showInvalid
   */
  showInvalid: Ember.computed('hasBeenBlurred', 'isValid', function() {
    return this.get('hasBeenBlurred') && !this.get('isValid');
  }),

  /**
   * whether or not the error message should be shown.
   *
   * @default  false
   * @property {Boolean} showErrorMessage
   */
  showErrorMessage: Ember.computed('showInvalid', 'errorMessage', function() {
    return this.get('showInvalid') && this.get('errorMessage');
  }),

  /**
   * The ID for the input field
   *
   * @property {String} fieldId
   */
  fieldId: Ember.computed('name', function() {
    return Ember.guidFor(this) + '-' + this.get('name');
  }),

  /**
   * The ID for the input field's label
   *
   * @property {String} labelId
   */
  labelId: Ember.computed('fieldId', function() {
    return this.get('fieldId') + '-label';
  }),

  /**
   * The ID for the input field's help text
   *
   * @property {String} helpTextId
   */
  helpTextId: Ember.computed('fieldId', function() {
    return this.get('fieldId') + '-helpText';
  }),

  /**
   * The input's label
   *
   * @property {String} fieldId
   */
  label: Ember.computed('name', function() {
    var name = Ember.String.underscore(this.get('name') || "");
    return name.replace(/_/g, " ");
  }),

  /**
   * The class name to be applied to the help text's container
   *
   * @property {String} helpTextClass
   */
  helpTextClass: Ember.computed('showErrorMessage', 'helpText', function() {
    var baseClassName = (this.get('classNames') || []).slice().pop();
    if (this.get('showErrorMessage')) {
      return baseClassName + '--errorMessage';
    }
    if (!this.get('helpText')) {
      return baseClassName + '--helpTextEmpty';
    }
  }),

  /**
   * a helper method that returns the input element from the DOM.
   *
   * @method  getInput
   * @return {jQuery} the input element
   */
  getInput: function() {
    return Ember.$(this.element).find(':input');
  },

  /**
   * handles the event bindings and notifies the 'value' observers
   * that the property has changed
   *
   * @method  didInsertElement
   * @return undefined
   */
  didInsertElement: function() {

    var self = this;
    var $input = this.getInput();
    var eventActionBindings = {
      focusIn: function() {
        this.setProperties({
          hasFocus: true,
          hasBeenFocused: true
        });
      },
      focusOut: function() {
        this.setProperties({
          hasFocus: false,
          hasBeenBlurred: true
        });
      },
      change: function() {
        console.log('change')
        this.setProperties({
          hasBeenChanged: true,
          value: this.getInput().val()
        });
      },
      input: function() {
        this.setProperties({
          hasBeenChanged: true,
          value: this.getInput().val()
        });
      },
      invalid: function() {
        this.setProperties({
          hasBeenBlurred: true
        });
      }
    };

    Object.keys(eventActionBindings).forEach(function(key) {
      $input.on(key.toLowerCase(), function() {
        eventActionBindings[key].call(self);
      });
    });

    $input.val(this.get('value'));

    Ember.run.next(function() {
      self.notifyPropertyChange('value');
    });

  },
  handleSettableValue: function() {
    var $input = this.getInput();
    $input.val(this.get('settableValue'));

    this.setProperties({
      hasBeenChanged: true,
      value: this.get('settableValue')
    });
  }.observes('settableValue'),

  /**
   * removes event listeners
   *
   * @method  willDestroyElement
   * @return undefined
   */
  willDestroyElement: function() {

    var $input = this.getInput();
    var events = [
      'focusIn',
      'focusOut',
      'change',
      'input',
      'invalid'
    ];

    events.forEach(function(e) {
      $input.off(e.toLowerCase());
    });

  }
});
