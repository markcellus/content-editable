import anchorme from 'anchorme';

const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];

export class EditableContent extends HTMLElement {
    previousInnerHTML?: HTMLElement['textContent'];

    connectedCallback() {
        const readonly = this.hasAttribute('readonly');
        this.contentEditable = readonly ? 'false' : 'true';
        this.parse();
        if (readonly) {
            return;
        }
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
        this.removeEventListener('keypress', this);
        this.removeEventListener('paste', this);
    }

    handleEvent(e: Event | KeyboardEvent) {
        if (e.type === 'focusin') {
            this.setAttribute('editing', '');
        } else if (e.type === 'focusout') {
            this.removeAttribute('editing');
            this.commit();
        } else if (e instanceof KeyboardEvent && e.type === 'keyup' && e.key === 'Escape') {
            this.parse();
            this.blur();
        } else if (
            !this.hasAttribute('multiline') &&
            e instanceof KeyboardEvent &&
            e.type === 'keypress' &&
            e.key === 'Enter'
        ) {
            e.preventDefault();
            this.commit();
        } else if (e.type === 'paste') {
            this.parse();
        }
    }

    private commit() {
        const { previousInnerHTML, innerHTML } = this;
        this.parse();
        this.blur();
        if (previousInnerHTML !== innerHTML) {
            this.dispatchEvent(new CustomEvent('edit'));
        }
    }

    private parse() {
        let innerHTML = this.innerHTML.trim();
        const parser = new DOMParser();
        if (this.hasAttribute('readonly')) {
            innerHTML = anchorme(innerHTML);
        }
        const htmlDoc = parser.parseFromString(innerHTML, 'text/html');
        this.innerHTML = htmlDoc.body.innerHTML;
        this.previousInnerHTML = this.innerHTML;
    }
}

customElements.define('editable-content', EditableContent);
