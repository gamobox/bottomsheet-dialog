import { ToggleState } from '@bottomsheet-dialog/core';

export class BsButton extends HTMLElement {
  private state: ToggleState;
  private unsubscribe: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = new ToggleState();
    
    // Default styling (Vanilla CSS)
    const style = document.createElement('style');
    style.textContent = `
      button {
        padding: 0.5rem 1rem;
        font-family: inherit;
        font-weight: 500;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: #3b82f6;
        color: white;
      }
      button:hover {
        background-color: #2563eb;
      }
      button.active {
        background-color: #10b981;
      }
      @media (forced-colors: active) {
        button {
          border: 2px solid CanvasText;
        }
      }
    `;

    const button = document.createElement('button');
    button.textContent = this.getAttribute('label') || 'Toggle';
    
    button.addEventListener('click', () => {
      this.state.toggle();
    });

    this.shadowRoot?.append(style, button);

    this.unsubscribe = this.state.subscribe((isOn) => {
      if (isOn) {
        button.classList.add('active');
        button.textContent = 'Active';
      } else {
        button.classList.remove('active');
        button.textContent = this.getAttribute('label') || 'Toggle';
      }
    });
  }

  disconnectedCallback() {
    this.unsubscribe();
  }
}

// Register the custom element
customElements.define('cq-button', BsButton);
