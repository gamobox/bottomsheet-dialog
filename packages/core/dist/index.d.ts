declare class ToggleState {
    private _isOn;
    private listeners;
    get isOn(): boolean;
    toggle(): void;
    subscribe(listener: (isOn: boolean) => void): () => boolean;
    private notify;
}

interface DrawerStateOptions {
    isOpen?: boolean;
    persistKey?: string;
    storage?: 'local' | 'session';
    snapPoints?: number[];
    onStateChange?: (isOpen: boolean) => void;
    onSnapPointChange?: (snapPoint: number, index: number) => void;
}
declare class DrawerState {
    private _isOpen;
    private persistKey?;
    private storageType;
    private snapPoints;
    private activeSnapPointIndex;
    private onStateChange?;
    private onSnapPointChange?;
    constructor(options?: DrawerStateOptions);
    get isOpen(): boolean;
    get hasSnapPoints(): boolean;
    get allSnapPoints(): number[];
    get currentSnapPoint(): number;
    open(): void;
    close(): void;
    toggle(): void;
    setSnapPointIndex(index: number): void;
    setSnapPoints(points: number[]): void;
    cycleSnapPoint(): void;
    stepSnapPoint(direction: 'up' | 'down'): void;
    private setOpen;
    private getStorage;
    private loadState;
    private saveState;
}

interface DragControllerOptions {
    element: HTMLElement;
    dialog: HTMLElement;
    onClose: () => void;
    snapPoints?: number[];
    onSnap?: (snapPoint: number) => void;
    dragHandleSelector?: string;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}
declare class DragController {
    private element;
    private dialog;
    private onClose;
    private snapPoints;
    private onSnap?;
    private dragHandleSelector;
    private onDragStart?;
    private onDragEnd?;
    private isDragging;
    private startY;
    private currentY;
    private startTime;
    private activePointerId;
    private startSnap;
    private currentSnap;
    private dialogHeight;
    constructor(options: DragControllerOptions);
    attach(): void;
    detach(): void;
    setSnapPoints(points: number[]): void;
    private onPointerDown;
    private onPointerMove;
    private onPointerUp;
    private onPointerCancel;
    private endDrag;
    private abortDrag;
    private getScrollParent;
}

export { DragController, type DragControllerOptions, DrawerState, type DrawerStateOptions, ToggleState };
