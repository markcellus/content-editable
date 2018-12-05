export declare class EditableContent extends HTMLElement {
    oldValue: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleEvent(e: Event | KeyboardEvent): void;
    commit(): void;
}
