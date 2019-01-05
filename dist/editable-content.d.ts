export declare class EditableContent extends HTMLElement {
    previousInnerHTML?: HTMLElement['textContent'];
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleEvent(e: Event | KeyboardEvent): void;
    private commit;
    private parseLinks;
    private parse;
}
