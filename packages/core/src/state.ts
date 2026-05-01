// Simple framework-agnostic state/logic for testing
export class ToggleState {
  private _isOn: boolean = false;
  private listeners: Set<(isOn: boolean) => void> = new Set();

  get isOn() {
    return this._isOn;
  }

  toggle() {
    this._isOn = !this._isOn;
    this.notify();
  }

  subscribe(listener: (isOn: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this._isOn));
  }
}
