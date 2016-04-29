'use strict';
import _ from 'lodash';


/**
 * A function that will be called when the value has changed
 * @callback {InlineEdit~onChange}
 * @param {String} newValue - The new value
 * @param {String} oldValue - The previous value before the change was made
 * @return {undefined|Boolean} Return false to avoid committing
 */

/**
 * A function that will be called before committing user's new value
 * @callback {InlineEdit~onValidate}
 * @param {String} newValue - The new value
 * @param {String} oldValue - The old value before the value was changed
 * @return {undefined|Boolean} Return false to avoid committing
 */

/**
 * @class InlineEdit
 * @description Allows you to select a text element on the page and edit it in-place.
 */
class InlineEdit {

    /**
     * When instantiated.
     * @param {HTMLElement} el - The element that is to be made editable
     * @param {Object} [options] - The options
     * @param {String} [options.editingClass] - The CSS class that will be applied to the editable element during editing
     * @param {String} [options.editingElement] - The element representing the editable state
     * @param {Function} [options.onChange] - When the user has committed a new value in the editable field
     * @param {InlineEdit~onValidate} [options.onValidate] - Triggered right before committing a new value to allow QUICK validation logic
     */
    constructor (el, options) {

        this.options = _.extend({
            editingClass: 'editing',
            editingElement: document.createElement('input'),
            onChange: null,
            onValidate: null
        }, options);

        this.el = el;
        this._editEl = this.options.editingElement;

        this._onClickEventListener = this.onClickElement.bind(this);
        this._onBlurEventListener = this.onCommit.bind(this);

        this.el.addEventListener('click', this._onClickEventListener, true);

        this._editEl.classList.add(this.options.editingClass);
        this._editEl.addEventListener('blur', this._onBlurEventListener, true);
    }

    showEdit() {
        if (!this.el.contains(this._editEl)) {
            this.el.appendChild(this._editEl);
        }
        this.editing = true;

        this._editEl.value = this.el.textContent.trim();
        this.el.parentNode.replaceChild(this._editEl, this.el);
        this._editEl.focus();
    }

    hideEdit() {

        if (!this.editing) {
            return;
        }

        if (this.el.contains(this._editEl)) {
            this.el.removeChild(this._editEl);
        }
        this._editEl.parentNode.replaceChild(this.el, this._editEl);
        this.editing = false;
        this._editEl.blur();
    }

    onCommit () {

        let oldValue = this.el.textContent;

        if (this._editEl.value === this.el.textContent) {
            this.hideEdit();
            return;
        }

        if (this.options.onValidate && this.options.onValidate(this._editEl.value, oldValue) === false) {
            return;
        }

        this.el.textContent = this._editEl.value;
        this.hideEdit();
        if (this.options.onChange) {
            this.options.onChange(this._editEl.value, oldValue);
        }
    }

    onClickElement () {
        this.showEdit();
    }

    destroy () {
        this.el.removeEventListener('click', this._onClickEventListener, true);
        this._editEl.removeEventListener('blur', this._onBlurEventListener, true);
        this.hideEdit();
    }

}

export default InlineEdit;
