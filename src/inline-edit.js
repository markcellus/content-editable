'use strict';
import _ from 'lodash';


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
     * @param {String} [options.type] - The element type, defaults to 'text' but also supports "textarea" atm
     * @param {Function} [options.onChange] - When the user has committed a new value in the editable field
     */
    constructor (el, options) {

        this.options = _.extend({
            editingClass: 'editing',
            onChange: null,
            type: 'text'
        }, options);

        this.el = el;

        this._onClickEventListener = this.onClickElement.bind(this);
        this._onBlurEventListener = this.onBlurInput.bind(this);

        this.el.addEventListener('click', this._onClickEventListener, true);

        if (this.options.type === 'textarea') {
            this._inputEl = document.createElement('textarea');
        } else {
            this._inputEl = document.createElement('input');
            this._inputEl.type = 'text';
        }
        this._inputEl.classList.add(this.options.editingClass);
        this._inputEl.addEventListener('blur', this._onBlurEventListener, true);
    }

    showEdit() {
        if (!this.el.contains(this._inputEl)) {
            this.el.appendChild(this._inputEl);
        }
        this.editing = true;

        this._inputEl.value = this.el.textContent.trim();
        this.el.parentNode.replaceChild(this._inputEl, this.el);
        this._inputEl.focus();
    }

    hideEdit() {

        if (!this.editing) {
            return;
        }

        if (this.el.contains(this._inputEl)) {
            this.el.removeChild(this._inputEl);
        }
        this._inputEl.parentNode.replaceChild(this.el, this._inputEl);
        this.editing = false;
        this._inputEl.blur();
    }

    onBlurInput () {

        let oldValue = this.el.textContent;
        this.hideEdit();

        if (this._inputEl.value === this.el.textContent) {
            return;
        }
        this.el.textContent = this._inputEl.value;

        if (this.options.onChange) {
            this.options.onChange(this._inputEl.value, oldValue);
        }
    }

    onClickElement () {
        this.showEdit();
    }

    destroy () {
        this.el.removeEventListener('click', this._onClickEventListener, true);
        this._inputEl.removeEventListener('blur', this._onBlurEventListener, true);
        this.hideEdit();
    }

}

export default InlineEdit;
