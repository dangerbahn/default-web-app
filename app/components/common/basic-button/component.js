import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'button',
  classNames: ['basicButton'],
  type: 'default',
  size: 'medium',
  align: 'center',
  disabled: false,
  block: false,
  textdecor: false,
  classNameBindings: [
    'typeCssClass',
    'sizeCssClass',
    'alignCssClass',
    'disabled:basicButton-isDisabled',
    'block:basicButton-isBlock'
  ],
  validTypes: [
    'default',
    'primary',
    'express',
    'link',
    'helper'
  ],
  validSizes: [
    'small',
    'medium',
    'large'
  ],
  validAlignValues: [
    'center',
    'left',
    'right'
  ],
  /**
   * The css class that applies the styles for the button's type
   *
   * @property {String} typeCssClass
   */
  typeCssClass: Ember.computed('type', 'disabled', 'validTypes', function() {

    var type = this.get('type');
    var disabled = this.get('disabled');
    var validTypes = this.get('validTypes');

    if (type === 'helper') {
      return 'basicButton-helper';
    }

    if (!disabled && validTypes.indexOf(type) !== -1) {
      return 'basicButton-' + type;
    }

    return 'basicButton-default';

  }),

  /**
   * The css class that applies the styles for the button's size
   *
   * @property {String} sizeCssClass
   */
  sizeCssClass: Ember.computed('size', 'validSizes', function() {

    var size = this.get('size');
    var validSizes = this.get('validSizes');

    if (validSizes.indexOf(size) !== -1) {
      return 'basicButton-' + size;
    }

    return 'basicButton-medium';

  }),

  /**
   * The css class that applies the styles for the button's text alignment
   *
   * @property {String} alignCssClass
   */
  alignCssClass: Ember.computed('align', 'validAlignValues', function() {

    var align = this.get('align');
    var validAlignValues = this.get('validAlignValues');

    if (validAlignValues.indexOf(align) !== -1) {
      return 'basicButton-align' + Ember.String.capitalize(align);
    }

    return 'basicButton-alignCenter';

  }),

  click: function(event){
    // don't let the event submit the form if there's an action
    if (this.get('disabled')) {
      return false;
    }
    if (this.get('action')) {
      event.preventDefault();
      event.stopPropagation();
      this.sendAction('action', this.get('param'));
    }
  },
});
