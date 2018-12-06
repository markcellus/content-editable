const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];

export class EditableContent extends HTMLElement {
    oldValue: string = '';

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

    handleEvent(e: Event | KeyboardEvent) {
        if (e.type === 'focusin') {
            this.setAttribute('editing', '');
        } else if (e.type === 'focusout') {
            this.removeAttribute('editing');
        } else if (e instanceof KeyboardEvent && e.type === 'keyup' && e.key === 'Escape') {
            this.textContent = this.oldValue;
            this.blur();
        }
    }

    commit() {
        const { oldValue } = this;
        this.dispatchEvent(new CustomEvent('edit', { detail: { newValue: this.textContent, oldValue } }));
    }
}

customElements.define('editable-content', EditableContent);
