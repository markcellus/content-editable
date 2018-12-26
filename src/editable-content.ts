const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];

export class EditableContent extends HTMLElement {
    oldValue: string = '';
    readonly: boolean;
    multiline: boolean = false;

    connectedCallback() {
        this.contentEditable = this.readonly === true ? 'false' : 'true';
        this.oldValue = this.textContent.trim() || '';
        SUPPORTED_EVENTS.forEach(type => {
            this.addEventListener(type, this);
        });
        if (!this.multiline) {
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
            this.textContent = this.oldValue;
            this.blur();
        } else if (!this.multiline && e instanceof KeyboardEvent && e.type === 'keypress' && e.key === 'Enter') {
            e.preventDefault();
            this.commit();
        }
    }

    commit() {
        const { oldValue } = this;
        const newValue = this.textContent.trim();
        this.oldValue = newValue;
        this.blur();
        this.dispatchEvent(new CustomEvent('edit', { detail: { newValue, oldValue } }));
    }
}

customElements.define('editable-content', EditableContent);
