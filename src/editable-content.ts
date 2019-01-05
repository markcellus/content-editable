import anchorme from 'anchorme';
import { URLObj } from 'anchorme/dist-node/util';

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

    private parseLinks(element: Element) {
        if (element.children.length) {
            const children = Array.from(element.children);
            children.forEach(child => {
                this.parseLinks(child);
            });
        } else if (element.textContent && element.textContent.trim()) {
            const urls = anchorme(element.innerHTML, {
                list: true,
                emails: false,
                urls: true,
                ips: false,
                files: false
            });
            urls.forEach((item: URLObj) => {
                const { raw: url } = item;
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(`<a href="${url}">${url}</a>`, 'text/html');
                const anchor = htmlDoc.body.querySelector('a');
                if (anchor) {
                    element.innerHTML = anchorme(element.innerHTML);
                }
            });
        }
    }

    private parse() {
        // remove all possible whitespace in HTML
        const { firstChild, lastChild } = this;
        [firstChild, lastChild].forEach((node: any) => {
            if (node.textContent && !node.textContent.trim()) {
                node.remove();
            }
        });

        if (this.hasAttribute('readonly')) {
            this.parseLinks(this);
        }
    }
}

customElements.define('editable-content', EditableContent);
