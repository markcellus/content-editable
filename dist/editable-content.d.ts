export declare class EditableContent extends HTMLElement {
    previousTextContent: HTMLElement['textContent'];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleEvent(e: Event | KeyboardEvent): void;
    commit(): void;
}
