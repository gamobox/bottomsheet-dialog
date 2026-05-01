import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrawerState } from './state';

describe('DrawerState', () => {
  it('should initialize with default values', () => {
    const state = new DrawerState();
    expect(state.isOpen).toBe(false);
    expect(state.hasSnapPoints).toBe(false);
    expect(state.currentSnapPoint).toBe(1);
    expect(state.allSnapPoints).toEqual([]);
  });

  it('should initialize with isOpen true', () => {
    const state = new DrawerState({ isOpen: true });
    expect(state.isOpen).toBe(true);
  });

  it('should open and close', () => {
    const state = new DrawerState();
    state.open();
    expect(state.isOpen).toBe(true);
    state.close();
    expect(state.isOpen).toBe(false);
  });

  it('should toggle', () => {
    const state = new DrawerState();
    state.toggle();
    expect(state.isOpen).toBe(true);
    state.toggle();
    expect(state.isOpen).toBe(false);
  });

  it('should trigger onStateChange callback', () => {
    const onStateChange = vi.fn();
    const state = new DrawerState({ onStateChange });
    
    state.open();
    expect(onStateChange).toHaveBeenCalledWith(true);
    
    state.close();
    expect(onStateChange).toHaveBeenCalledWith(false);
  });

  describe('Snap Points', () => {
    it('should initialize and sort snap points', () => {
      const state = new DrawerState({ snapPoints: [1, 0.5, 0.2] });
      expect(state.hasSnapPoints).toBe(true);
      expect(state.allSnapPoints).toEqual([0.2, 0.5, 1]);
    });

    it('should set default snap point to smallest when closed', () => {
      const state = new DrawerState({ snapPoints: [0.5, 1] });
      expect(state.currentSnapPoint).toBe(0.5);
    });

    it('should trigger onSnapPointChange with initial snap point if opened initially', () => {
      const onSnapPointChange = vi.fn();
      new DrawerState({ snapPoints: [0.5, 1], isOpen: true, onSnapPointChange });
      expect(onSnapPointChange).toHaveBeenCalledWith(0.5, 0);
    });

    it('should reset to lowest snap point on open', () => {
      const state = new DrawerState({ snapPoints: [0.5, 1] });
      state.setSnapPointIndex(1); // Set to 1
      state.close();
      state.open();
      expect(state.currentSnapPoint).toBe(0.5); // Lowest point
    });

    it('should trigger onSnapPointChange', () => {
      const onSnapPointChange = vi.fn();
      const state = new DrawerState({ snapPoints: [0.5, 1], onSnapPointChange });
      
      state.setSnapPointIndex(1);
      expect(onSnapPointChange).toHaveBeenCalledWith(1, 1);
    });

    it('should step up and down snap points', () => {
      const state = new DrawerState({ snapPoints: [0.2, 0.5, 1], isOpen: true });
      expect(state.currentSnapPoint).toBe(0.2); // Initial is lowest
      
      state.stepSnapPoint('up');
      expect(state.currentSnapPoint).toBe(0.5);
      
      state.stepSnapPoint('up');
      expect(state.currentSnapPoint).toBe(1);
      
      state.stepSnapPoint('down');
      expect(state.currentSnapPoint).toBe(0.5);
      
      state.stepSnapPoint('down');
      expect(state.currentSnapPoint).toBe(0.2);
      
      state.stepSnapPoint('down'); // At bottom, should close
      expect(state.isOpen).toBe(false);
    });

    it('should cycle snap points', () => {
      const state = new DrawerState({ snapPoints: [0.5, 1], isOpen: true });
      expect(state.currentSnapPoint).toBe(0.5);
      
      state.cycleSnapPoint();
      expect(state.currentSnapPoint).toBe(1);
      
      state.cycleSnapPoint();
      expect(state.currentSnapPoint).toBe(0.5);
    });

    it('should update snap points dynamically', () => {
      const state = new DrawerState({ snapPoints: [1], isOpen: true });
      state.setSnapPoints([0.5, 0.8, 1]);
      expect(state.allSnapPoints).toEqual([0.5, 0.8, 1]);
      expect(state.currentSnapPoint).toBe(0.5); // Resets index to 0 or keeps it valid
    });
  });

  describe('Persistence', () => {
    let mockStorage: Record<string, string>;
    
    beforeEach(() => {
      mockStorage = {};
      const storageMock = {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        length: 0,
        clear: vi.fn(),
        key: vi.fn(),
        removeItem: vi.fn()
      } as Storage;
      
      vi.stubGlobal('window', {
        sessionStorage: storageMock,
        localStorage: storageMock
      });
    });

    it('should save and load state from storage', () => {
      const state1 = new DrawerState({ persistKey: 'test-drawer' });
      state1.open(); // Should save 'true' to storage
      
      const state2 = new DrawerState({ persistKey: 'test-drawer' });
      expect(state2.isOpen).toBe(true); // Should load 'true' from storage
    });
  });
});
