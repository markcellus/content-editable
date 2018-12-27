const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];

export class EditableContent extends HTMLElement {
    previousTextContent?: HTMLElement['textContent'];

    connectedCallback() {
        this.contentEditable = this.hasAttribute('readonly') ? 'false' : 'true';
        this.previousTextContent = this.textContent;
        if (this.textContent) {
            this.parseContent(this.textContent);
        }
        SUPPORTED_EVENTS.forEach(type => {
            this.addEventListener(type, this);
        });
        if (!this.hasAttribute('multiline')) {
            this.addEventListener('keypress', this);
            this.addEventListener('paste', this);
        }
    }

    parseContent(value?: HTMLElement['textContent']) {
        if (!value) return;
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(value, 'text/html');
        const frag = document.createDocumentFragment();
        const pre = document.createElement('pre');
        pre.style.font = 'inherit';
        frag.appendChild(pre);
        const { childNodes } = htmlDoc.body;

        for (const node of Array.from(childNodes)) {
            pre.appendChild(node);
        }
        this.innerHTML = '';
        this.appendChild(frag);
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
            this.parseContent(this.previousTextContent);
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
        this.parseContent(textContent);
        this.blur();
        if (previousTextContent !== textContent) {
            this.dispatchEvent(new CustomEvent('edit', { detail: { textContent, previousTextContent } }));
        }
    }
}

customElements.define('editable-content', EditableContent);
