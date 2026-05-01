declare class BsButton extends HTMLElement {
    private state;
    private unsubscribe;
    constructor();
    disconnectedCallback(): void;
}

declare class BsDialog extends HTMLElement {
    private dialog;
    private dragHandle;
    private drawerState;
    private dragController;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private render;
    private setupLogic;
    private onDialogClose;
    private onHandleClick;
    private onHandleKeyDown;
    private onLightDismiss;
    open(): void;
    close(): void;
}

export { BsButton, BsDialog };
