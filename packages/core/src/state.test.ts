import { describe, it, expect } from 'vitest';
import { ToggleState } from './state';

describe('ToggleState', () => {
  it('should toggle state correctly', () => {
    const state = new ToggleState();
    expect(state.isOn).toBe(false);
    
    state.toggle();
    expect(state.isOn).toBe(true);
    
    state.toggle();
    expect(state.isOn).toBe(false);
  });

  it('should notify listeners on toggle', () => {
    const state = new ToggleState();
    let notifiedValue: boolean | null = null;
    
    state.subscribe((val) => {
      notifiedValue = val;
    });

    state.toggle();
    expect(notifiedValue).toBe(true);
  });
});
