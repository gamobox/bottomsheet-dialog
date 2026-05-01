export interface DrawerStateOptions {
  isOpen?: boolean;
  persistKey?: string;
  storage?: 'local' | 'session';
  snapPoints?: number[];
  onStateChange?: (isOpen: boolean) => void;
  onSnapPointChange?: (snapPoint: number, index: number) => void;
}

export class DrawerState {
  private _isOpen: boolean;
  private persistKey?: string;
  private storageType: 'local' | 'session';
  private snapPoints: number[] = [];
  private activeSnapPointIndex: number = -1;
  
  private onStateChange?: (isOpen: boolean) => void;
  private onSnapPointChange?: (snapPoint: number, index: number) => void;

  constructor(options: DrawerStateOptions = {}) {
    this.persistKey = options.persistKey;
    this.storageType = options.storage || 'session';
    this.onStateChange = options.onStateChange;
    this.onSnapPointChange = options.onSnapPointChange;

    if (options.snapPoints && options.snapPoints.length > 0) {
      this.snapPoints = [...options.snapPoints].sort((a, b) => a - b);
      this.activeSnapPointIndex = 0; // Default to smallest snap point
    }

    const savedState = this.loadState();
    this._isOpen = savedState !== null ? savedState : (options.isOpen || false);
    
    // If opening from restored state with snap points, initialize snap point
    if (this._isOpen && this.snapPoints.length > 0) {
       this.onSnapPointChange?.(this.snapPoints[this.activeSnapPointIndex], this.activeSnapPointIndex);
    }
  }

  get isOpen() {
    return this._isOpen;
  }
  
  get hasSnapPoints() {
    return this.snapPoints.length > 0;
  }
  
  get allSnapPoints() {
    return this.snapPoints;
  }
  
  get currentSnapPoint(): number {
    if (!this.hasSnapPoints) return 1;
    return this.snapPoints[this.activeSnapPointIndex];
  }

  open() {
    this.setOpen(true);
    if (this.hasSnapPoints) {
      this.activeSnapPointIndex = 0; // Reset to lowest snap point on open
      this.onSnapPointChange?.(this.snapPoints[0], 0);
    }
  }

  close() {
    this.setOpen(false);
  }

  toggle() {
    if (this._isOpen) this.close();
    else this.open();
  }
  
  setSnapPointIndex(index: number) {
    if (!this.hasSnapPoints || index < 0 || index >= this.snapPoints.length) return;
    this.activeSnapPointIndex = index;
    this.onSnapPointChange?.(this.snapPoints[index], index);
  }

  setSnapPoints(points: number[]) {
    this.snapPoints = [...points].sort((a, b) => a - b);
    if (!this.hasSnapPoints) {
      this.activeSnapPointIndex = -1;
    } else if (this.activeSnapPointIndex >= this.snapPoints.length) {
      this.setSnapPointIndex(this.snapPoints.length - 1);
    } else if (this.activeSnapPointIndex === -1) {
      this.setSnapPointIndex(0);
    }
  }

  cycleSnapPoint() {
    if (!this.hasSnapPoints) return;
    const nextIdx = (this.activeSnapPointIndex + 1) % this.snapPoints.length;
    this.setSnapPointIndex(nextIdx);
  }

  stepSnapPoint(direction: 'up' | 'down') {
    if (!this.hasSnapPoints) return;
    if (direction === 'up') {
      const nextIdx = Math.min(this.snapPoints.length - 1, this.activeSnapPointIndex + 1);
      this.setSnapPointIndex(nextIdx);
    } else {
      if (this.activeSnapPointIndex === 0) {
        this.close();
      } else {
        this.setSnapPointIndex(this.activeSnapPointIndex - 1);
      }
    }
  }

  private setOpen(value: boolean) {
    if (this._isOpen === value) return;
    this._isOpen = value;
    this.saveState();
    this.onStateChange?.(value);
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return this.storageType === 'local' ? window.localStorage : window.sessionStorage;
  }

  private loadState(): boolean | null {
    if (!this.persistKey) return null;
    const storage = this.getStorage();
    if (!storage) return null;
    
    const value = storage.getItem(this.persistKey);
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
  }

  private saveState() {
    if (!this.persistKey) return;
    const storage = this.getStorage();
    if (!storage) return;
    storage.setItem(this.persistKey, String(this._isOpen));
  }
}
