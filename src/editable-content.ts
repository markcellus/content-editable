const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];

export class EditableContent extends HTMLElement {

    previousTextContent: HTMLElement['textContent'];

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

    handleEvent(e: Event | KeyboardEvent) {
        if (e.type === 'focusin') {
            this.setAttribute('editing', '');
        } else if (e.type === 'focusout') {
            this.removeAttribute('editing');
            this.commit();
        } else if (e instanceof KeyboardEvent && e.type === 'keyup' && e.key === 'Escape') {
            this.textContent = this.previousTextContent;
            this.blur();
        } else if (
            !this.hasAttribute('multiline') &&
            e instanceof KeyboardEvent &&
            e.type === 'keypress' &&
            e.key === 'Enter'
        ) {
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
