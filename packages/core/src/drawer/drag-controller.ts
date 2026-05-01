export interface DragControllerOptions {
  element: HTMLElement;
  dialog: HTMLElement;
  onClose: () => void;
  snapPoints?: number[];
  onSnap?: (snapPoint: number) => void;
  dragHandleSelector?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export class DragController {
  private element: HTMLElement;
  private dialog: HTMLElement;
  private onClose: () => void;
  private snapPoints: number[];
  private onSnap?: (snapPoint: number) => void;
  private dragHandleSelector: string;
  private onDragStart?: () => void;
  private onDragEnd?: () => void;
  
  private isDragging = false;
  private startY = 0;
  private currentY = 0;
  private startTime = 0;
  private activePointerId: number | null = null;
  private startSnap = 1;
  private currentSnap = 1;
  private dialogHeight = 0;

  constructor(options: DragControllerOptions) {
    this.element = options.element;
    this.dialog = options.dialog;
    this.onClose = options.onClose;
    this.snapPoints = options.snapPoints || [];
    this.onSnap = options.onSnap;
    this.dragHandleSelector = options.dragHandleSelector || '.drag-handle';
    this.onDragStart = options.onDragStart;
    this.onDragEnd = options.onDragEnd;

    this.attach();
  }

  public attach() {
    this.element.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerCancel);
  }

  public detach() {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerCancel);
  }

  public setSnapPoints(points: number[]) {
    this.snapPoints = points;
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || this.isDragging) return;

    const target = e.target as HTMLElement;

    // Allow touch devices to drag from anywhere, but restrict mouse/pen to the drag handle
    // This allows text selection via mouse drag in the content area without interference
    if (e.pointerType !== 'touch') {
      const isDragHandle = target.closest(this.dragHandleSelector);
      if (!isDragHandle) {
        return;
      }
    }

    const isScrollable = target.scrollHeight > target.clientHeight;
    
    if (isScrollable && target.scrollTop > 0) {
      return;
    }

    if (window.getSelection()?.toString().length) {
      return;
    }

    this.isDragging = true;
    this.activePointerId = e.pointerId;
    this.startY = e.clientY;
    this.currentY = e.clientY;
    this.startTime = performance.now();
    
    this.dialogHeight = this.dialog.getBoundingClientRect().height;
    const snapStr = this.dialog.style.getPropertyValue('--snap-point');
    this.startSnap = snapStr ? parseFloat(snapStr) : 1;
    this.currentSnap = this.startSnap;

    this.element.setPointerCapture(e.pointerId);
    
    this.dialog.style.transition = 'none';
    this.onDragStart?.();
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;

    e.preventDefault();

    this.currentY = e.clientY;
    const deltaY = this.currentY - this.startY;

    let offset = (this.dialogHeight * (1 - this.startSnap)) + deltaY;
    
    const maxSnap = this.snapPoints.length > 0 ? Math.max(...this.snapPoints) : 1;
    const minOffset = this.dialogHeight * (1 - maxSnap);
    
    if (offset < minOffset) {
      offset = minOffset - Math.sqrt(minOffset - offset) * 2;
    }

    this.currentSnap = 1 - (offset / this.dialogHeight);
    this.dialog.style.setProperty('--snap-point', this.currentSnap.toString());
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;
    this.endDrag(e.clientY);
  };

  private onPointerCancel = (e: PointerEvent) => {
    if (!this.isDragging || e.pointerId !== this.activePointerId) return;
    this.abortDrag();
  };

  private endDrag(endY: number) {
    this.isDragging = false;
    this.activePointerId = null;
    
    const deltaY = endY - this.startY;
    const deltaTime = performance.now() - this.startTime;
    const velocity = deltaY / deltaTime;

    this.dialog.style.transition = '';
    
    let targetSnap = 0;
    const points = this.snapPoints.length > 0 ? [...this.snapPoints, 0] : [1, 0];
    
    const velocityBias = velocity * -0.2; 
    const effectiveSnap = this.currentSnap + velocityBias;
    
    targetSnap = points.reduce((prev, curr) => {
      return (Math.abs(curr - effectiveSnap) < Math.abs(prev - effectiveSnap) ? curr : prev);
    });

    if (targetSnap === 0) {
      this.onClose();
    } else {
      if (this.onSnap) {
        this.onSnap(targetSnap);
      } else {
        this.dialog.style.setProperty('--snap-point', targetSnap.toString());
      }
    }
    
    this.currentY = 0;
    this.onDragEnd?.();
  }

  private abortDrag() {
    this.isDragging = false;
    this.activePointerId = null;
    this.dialog.style.transition = '';
    this.dialog.style.setProperty('--snap-point', this.startSnap.toString());
    this.currentY = 0;
    this.onDragEnd?.();
  }

  private getScrollParent(node: HTMLElement | null): HTMLElement | null {
    if (!node) return null;
    if (node === this.element) return null;

    const isScrollable = node.scrollHeight > node.clientHeight;
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const isAutoOrScroll = overflowY === 'auto' || overflowY === 'scroll';

    if (isScrollable && isAutoOrScroll) {
      return node;
    }
    return this.getScrollParent(node.parentElement);
  }
}
