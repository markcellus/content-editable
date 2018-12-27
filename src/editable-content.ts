import anchorme from 'anchorme';

const SUPPORTED_EVENTS = ['focusin', 'focusout', 'keyup'];

export class EditableContent extends HTMLElement {
    previousTextContent?: HTMLElement['textContent'];
    private observer?: MutationObserver;

    connectedCallback() {
        const readonly = this.hasAttribute('readonly');
        this.contentEditable = readonly ? 'false' : 'true';
        this.previousTextContent = this.textContent;
        if (this.textContent) {
            this.parseContent(this.textContent);
        }
        if (readonly) return;

        this.observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (this.textContent) {
                        this.parseContent(this.textContent);
                    }
                }
            }
        });
        this.observer.observe(this, { childList: true, subtree: true });

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
        const { innerHTML } = htmlDoc.body;
        if (innerHTML === this.innerHTML) return;
        this.innerHTML = this.hasAttribute('readonly') ? anchorme(innerHTML) : innerHTML;
    }

    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
        }
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
        this.parseContent(textContent);
        this.previousTextContent = textContent;
        this.blur();
        if (previousTextContent !== textContent) {
            this.dispatchEvent(new CustomEvent('edit', { detail: { textContent, previousTextContent } }));
        }
    }
}

customElements.define('editable-content', EditableContent);
