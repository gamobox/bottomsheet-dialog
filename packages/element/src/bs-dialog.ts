import { DrawerState, DragController } from '@bottomsheet-dialog/core';

export class BsDialog extends HTMLElement {
  private dialog!: HTMLDialogElement;
  private dragHandle!: HTMLButtonElement;
  private drawerState!: DrawerState;
  private dragController!: DragController;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['open', 'persist-key', 'snap-points'];
  }

  connectedCallback() {
    this.render();
    this.setupLogic();
  }

  disconnectedCallback() {
    this.dragController?.detach();
    this.dialog?.removeEventListener('close', this.onDialogClose);
    this.dialog?.removeEventListener('click', this.onLightDismiss);
    this.dragHandle?.removeEventListener('click', this.onHandleClick);
    this.dragHandle?.removeEventListener('keydown', this.onHandleKeyDown);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'open' && this.drawerState) {
      if (newValue !== null && !this.drawerState.isOpen) {
        this.drawerState.open();
      } else if (newValue === null && this.drawerState.isOpen) {
        this.drawerState.close();
      }
    }
    if (name === 'snap-points') {
      const points = newValue ? newValue.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)) : [1];
      if (this.drawerState) {
        this.drawerState.setSnapPoints(points);
      }
      if (this.dragController) {
        this.dragController.setSnapPoints(points);
      }
    }
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: contents;
        }

        dialog {
          padding: 0;
          margin: 0;
          border: none;
          
          /* Position at the bottom */
          position: fixed;
          top: auto;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: 100vw;
          max-height: 90vh;
          
          background: var(--bs-dialog-bg, #ffffff);
          border-top-left-radius: var(--bs-dialog-radius, 16px);
          border-top-right-radius: var(--bs-dialog-radius, 16px);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          
        /* Closed state explicit styles */
          display: none;
          flex-direction: column;
          opacity: 0;
          /* Use a single transform declaration and change the variable to avoid Safari calc() interpolation bugs */
          transform: translateY(calc(100% * (1 - var(--_current-snap, 0))));
          
          /* Setup animation */
          transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1),
                      opacity 0.3s ease,
                      display 0.3s allow-discrete,
                      overlay 0.3s allow-discrete;
        }

        dialog[open] {
          display: flex;
          flex-direction: column;
          opacity: 1;
          --_current-snap: var(--snap-point, 1);
        }

        @starting-style {
          dialog[open] {
            opacity: 0;
            --_current-snap: 0;
          }
        }
        
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.3s ease, display 0.3s allow-discrete, overlay 0.3s allow-discrete;
        }

        dialog[open]::backdrop {
          opacity: var(--snap-point, 1);
        }

        @starting-style {
          dialog[open]::backdrop {
            opacity: 0;
          }
        }

        /* Accessibility: Forced Colors Mode (High Contrast) */
        @media (forced-colors: active) {
          dialog {
            box-sizing: border-box;
            border: 2px solid CanvasText;
          }
        }

        /* Accessibility: Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          dialog,
          dialog::backdrop {
            transition: none !important;
            animation: none !important;
          }
        }

        .drag-handle {
          width: 100%;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: grab;
          flex-shrink: 0;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
          background: transparent;
          border: none;
          padding: 0;
          outline-offset: -4px;
        }

        .drag-handle:focus-visible {
          outline: 2px solid var(--bs-dialog-focus-color, #0070f3);
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .drag-handle-bar {
          width: 40px;
          height: 4px;
          background: var(--bs-dialog-handle-color, #e0e0e0);
          border-radius: 2px;
        }

        .slot-container {
          overflow-y: auto;
          flex-grow: 1;
          padding: var(--bs-dialog-padding, 16px);
          touch-action: pan-x pan-y;
        }
      </style>
      
      <dialog part="dialog">
        <button class="drag-handle" part="drag-handle" aria-label="Resize drawer">
          <div class="drag-handle-bar"></div>
        </button>
        <div class="slot-container" part="content">
          <slot></slot>
        </div>
      </dialog>
    `;
    
    this.dialog = this.shadowRoot!.querySelector('dialog')!;
    this.dragHandle = this.shadowRoot!.querySelector('.drag-handle')!;
  }

  private setupLogic() {
    const persistKey = this.getAttribute('persist-key') || undefined;
    const initialOpen = this.hasAttribute('open');
    const snapPointsAttr = this.getAttribute('snap-points');
    const snapPoints = snapPointsAttr ? snapPointsAttr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)) : [1];

    this.drawerState = new DrawerState({
      isOpen: initialOpen,
      persistKey,
      snapPoints,
      onStateChange: (isOpen: boolean) => {
        if (isOpen) {
          // Lock background scroll
          document.body.style.setProperty('overflow', 'hidden');

          if (!this.dialog.open) {
            this.dialog.showModal();
          }
          if (!this.hasAttribute('open')) {
              this.setAttribute('open', '');
          }
          this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
        } else {
          // Unlock background scroll (only if no other dialogs are still open)
          const otherOpenDialogs = document.querySelectorAll('bs-dialog[open]');
          if (otherOpenDialogs.length <= 1) {
            document.body.style.removeProperty('overflow');
          }

          if (this.dialog.open) {
              this.dialog.close();
          }
          if (this.hasAttribute('open')) {
              this.removeAttribute('open');
          }
          this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
        }
      },
      onSnapPointChange: (snapPoint: number, index: number) => {
        this.dialog.style.setProperty('--snap-point', snapPoint.toString());
        this.dispatchEvent(new CustomEvent('snap-change', {
          detail: { point: snapPoint, index },
          bubbles: true,
          composed: true
        }));
      }
    });

    this.dragController = new DragController({
      element: this.dialog,
      dialog: this.dialog,
      snapPoints,
      onSnap: (snapPoint: number) => {
        const index = this.drawerState.allSnapPoints.indexOf(snapPoint);
        if (index !== -1) {
          this.drawerState.setSnapPointIndex(index);
        }
      },
      onClose: () => {
        this.drawerState.close();
      },
      onDragStart: () => {
        this.dispatchEvent(new CustomEvent('drag-start', { bubbles: true, composed: true }));
      },
      onDragEnd: () => {
        this.dispatchEvent(new CustomEvent('drag-end', { bubbles: true, composed: true }));
      }
    });

    // Native dialog close handling (e.g. pressing ESC)
    this.dialog.addEventListener('close', this.onDialogClose);
    
    // Light dismiss
    this.dialog.addEventListener('click', this.onLightDismiss);

    // Keyboard accessibility for snap points
    this.dragHandle.addEventListener('click', this.onHandleClick);
    this.dragHandle.addEventListener('keydown', this.onHandleKeyDown);

    // Initial state setup if it was restored from storage
    if (this.drawerState.isOpen && !this.dialog.open) {
        this.dialog.showModal();
        if (!this.hasAttribute('open')) {
            this.setAttribute('open', '');
        }
    }
  }

  private onDialogClose = () => {
    // Sync state when closed by ESC
    if (this.drawerState.isOpen) {
        this.drawerState.close();
    }
  };

  private onHandleClick = () => {
    if (this.drawerState) {
      this.drawerState.cycleSnapPoint();
    }
  };

  private onHandleKeyDown = (e: KeyboardEvent) => {
    if (!this.drawerState) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.drawerState.stepSnapPoint('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.drawerState.stepSnapPoint('down');
    }
  };

  private onLightDismiss = (e: MouseEvent) => {
    // Click on the backdrop rather than its contents
    if (e.target === this.dialog) {
      const rect = this.dialog.getBoundingClientRect();
      const isOutside = 
        e.clientY < rect.top || 
        e.clientY > rect.bottom || 
        e.clientX < rect.left || 
        e.clientX > rect.right;
        
      if (isOutside) {
        this.drawerState.close();
      }
    }
  };
  
  public open() {
    this.drawerState.open();
  }
  
  public close() {
    this.drawerState.close();
  }
}

if (!customElements.get('bs-dialog')) {
  customElements.define('bs-dialog', BsDialog);
}
