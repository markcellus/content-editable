/*!
 * Editable-content v3.0.1
 * https://github.com/mkay581/editable-content#readme
 *
 * Copyright (c) 2018 Mark Kennedy
 * Licensed under the ISC license
 */

const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];
class EditableContent extends HTMLElement {
    constructor() {
        super(...arguments);
        this.oldValue = '';
    }
    connectedCallback() {
        this.contentEditable = this.contentEditable || 'true';
        this.oldValue = this.textContent || '';
        SUPPORTED_EVENTS.forEach(type => {
            this.addEventListener(type, this);
        });
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
        }
        else if (e instanceof KeyboardEvent && e.type === 'keyup' && e.key === 'Escape') {
            this.textContent = this.oldValue;
            this.blur();
        }
    }
    commit() {
        const { oldValue } = this;
        this.dispatchEvent(new CustomEvent('commit', { detail: { newValue: this.textContent, oldValue } }));
    }
}
customElements.define('editable-content', EditableContent);

export { EditableContent };
