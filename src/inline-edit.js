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
     * @param {String} [options.editingClass] - The CSS class that will be applied when the element is editable
     * @param {String} [options.hoverClass] - The CSS class that will be applied when hovering over the element
     * @param {String} [options.editElementClass] - A custom CSS class that will be applied to the editable version of the element
     * @param {Function} [options.onChange] - When the user has committed a new value in the editable field
     */
    constructor (el, options) {

        this.options = _.extend({
            editingClass: 'editing',
            hoverClass: 'hovering',
            editElementClass: 'edit-field',
            onChange: null
        }, options);

        this.el = el;

        this._onClickEventListener = this.onClickElement.bind(this);
        this._onHoverEventListener = this.onHoverElement.bind(this);
        this._onBlurEventListener = this.onBlurInput.bind(this);

        this.el.addEventListener('mouseenter', this._onHoverEventListener, true);
        this.el.addEventListener('mouseout', this._onHoverEventListener, true);
        this.el.addEventListener('click', this._onClickEventListener, true);

        this._inputEl = document.createElement('textarea');
        this._inputEl.classList.add(this.options.editElementClass);
        this._inputEl.addEventListener('blur', this._onBlurEventListener, true);
    }

    showEdit() {
        if (!this.el.contains(this._inputEl)) {
            this.el.appendChild(this._inputEl);
        }
        this.editing = true;

        this.el.classList.add(this.options.editingClass);
        this._inputEl.value = this.el.textContent;
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
        this.el.classList.remove(this.options.editingClass);
        this._inputEl.parentNode.replaceChild(this.el, this._inputEl);
        this.editing = false;
        this._inputEl.blur();
    }

    onBlurInput () {
        this.hideEdit();

        if (this._inputEl.value === this.el.textContent) {
            return;
        }
        this.el.textContent = this._inputEl.value;

        if (this.options.onChange) {
            this.options.onChange(this._inputEl.value);
        }
    }

    onHoverElement (e) {
        if (e.type === 'mouseenter') {
            this.el.classList.add(this.options.hoverClass);
        } else {
            this.el.classList.remove(this.options.hoverClass);
        }
    }

    onClickElement () {
        this.showEdit();
    }

    destroy () {
        this.el.removeEventListener('mouseenter', this._onHoverEventListener, true);
        this.el.removeEventListener('mouseout', this._onHoverEventListener, true);
        this.el.removeEventListener('click', this._onClickEventListener, true);
        this._inputEl.removeEventListener('blur', this._onBlurEventListener, true);
        this.hideEdit();
    }

}

export default InlineEdit;
