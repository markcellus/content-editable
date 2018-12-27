/*!
 * Editable-content v3.1.0
 * https://github.com/mkay581/editable-content#readme
 *
 * Copyright (c) 2018 Mark Kennedy
 * Licensed under the ISC license
 */

const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];
class EditableContent extends HTMLElement {
    constructor() {
        super();
        this.previousTextContent = this.textContent;
    }
    connectedCallback() {
        this.contentEditable = this.hasAttribute('readonly') ? 'false' : 'true';
        SUPPORTED_EVENTS.forEach(type => {
            this.addEventListener(type, this);
        });
        if (!this.hasAttribute('multiline')) {
            this.addEventListener('keypress', this);
            this.addEventListener('paste', this);
        }
    }
    disconnectedCallback() {
        SUPPORTED_EVENTS.forEach(type => {
            this.removeEventListener(type, this);
        });
    }
    handleEvent(e) {
        if (e.type === 'focusin') {
            this.setAttribute('editing', '');
        }
        else if (e.type === 'focusout') {
            this.removeAttribute('editing');
            this.commit();
        }
        else if (e instanceof KeyboardEvent && e.type === 'keyup' && e.key === 'Escape') {
            this.textContent = this.previousTextContent;
            this.blur();
        }
        else if (!this.hasAttribute('multiline') &&
            e instanceof KeyboardEvent &&
            e.type === 'keypress' &&
            e.key === 'Enter') {
            e.preventDefault();
            this.commit();
        }
    }
    commit() {
        const { textContent, previousTextContent } = this;
        this.previousTextContent = textContent;
        this.blur();
        if (previousTextContent !== textContent) {
            this.dispatchEvent(new CustomEvent('edit', { detail: { textContent, previousTextContent } }));
        }
    }
}
customElements.define('editable-content', EditableContent);

export { EditableContent };
