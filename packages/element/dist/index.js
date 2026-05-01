import{ToggleState as l}from"@bottomsheet-dialog/core";var r=class extends HTMLElement{state;unsubscribe;constructor(){super(),this.attachShadow({mode:"open"}),this.state=new l;let t=document.createElement("style");t.textContent=`
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
    `;let e=document.createElement("button");e.textContent=this.getAttribute("label")||"Toggle",e.addEventListener("click",()=>{this.state.toggle()}),this.shadowRoot?.append(t,e),this.unsubscribe=this.state.subscribe(o=>{o?(e.classList.add("active"),e.textContent="Active"):(e.classList.remove("active"),e.textContent=this.getAttribute("label")||"Toggle")})}disconnectedCallback(){this.unsubscribe()}};customElements.define("cq-button",r);import{DrawerState as c,DragController as p}from"@bottomsheet-dialog/core";var n=class extends HTMLElement{dialog;dragHandle;drawerState;dragController;constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["open","persist-key","snap-points"]}connectedCallback(){this.render(),this.setupLogic()}disconnectedCallback(){this.dragController?.detach(),this.dialog?.removeEventListener("close",this.onDialogClose),this.dialog?.removeEventListener("click",this.onLightDismiss),this.dragHandle?.removeEventListener("click",this.onHandleClick),this.dragHandle?.removeEventListener("keydown",this.onHandleKeyDown)}attributeChangedCallback(t,e,o){if(t==="open"&&this.drawerState&&(o!==null&&!this.drawerState.isOpen?this.drawerState.open():o===null&&this.drawerState.isOpen&&this.drawerState.close()),t==="snap-points"){let a=o?o.split(",").map(i=>parseFloat(i.trim())).filter(i=>!isNaN(i)):[1];this.drawerState&&this.drawerState.setSnapPoints(a),this.dragController&&this.dragController.setSnapPoints(a)}}render(){this.shadowRoot.innerHTML=`
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
    `,this.dialog=this.shadowRoot.querySelector("dialog"),this.dragHandle=this.shadowRoot.querySelector(".drag-handle")}setupLogic(){let t=this.getAttribute("persist-key")||void 0,e=this.hasAttribute("open"),o=this.getAttribute("snap-points"),a=o?o.split(",").map(i=>parseFloat(i.trim())).filter(i=>!isNaN(i)):[1];this.drawerState=new c({isOpen:e,persistKey:t,snapPoints:a,onStateChange:i=>{i?(document.body.style.setProperty("overflow","hidden"),this.dialog.open||this.dialog.showModal(),this.hasAttribute("open")||this.setAttribute("open",""),this.dispatchEvent(new CustomEvent("open",{bubbles:!0,composed:!0}))):(document.querySelectorAll("bs-dialog[open]").length<=1&&document.body.style.removeProperty("overflow"),this.dialog.open&&this.dialog.close(),this.hasAttribute("open")&&this.removeAttribute("open"),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0})))},onSnapPointChange:(i,s)=>{this.dialog.style.setProperty("--snap-point",i.toString()),this.dispatchEvent(new CustomEvent("snap-change",{detail:{point:i,index:s},bubbles:!0,composed:!0}))}}),this.dragController=new p({element:this.dialog,dialog:this.dialog,snapPoints:a,onSnap:i=>{let s=this.drawerState.allSnapPoints.indexOf(i);s!==-1&&this.drawerState.setSnapPointIndex(s)},onClose:()=>{this.drawerState.close()},onDragStart:()=>{this.dispatchEvent(new CustomEvent("drag-start",{bubbles:!0,composed:!0}))},onDragEnd:()=>{this.dispatchEvent(new CustomEvent("drag-end",{bubbles:!0,composed:!0}))}}),this.dialog.addEventListener("close",this.onDialogClose),this.dialog.addEventListener("click",this.onLightDismiss),this.dragHandle.addEventListener("click",this.onHandleClick),this.dragHandle.addEventListener("keydown",this.onHandleKeyDown),this.drawerState.isOpen&&!this.dialog.open&&(this.dialog.showModal(),this.hasAttribute("open")||this.setAttribute("open",""))}onDialogClose=()=>{this.drawerState.isOpen&&this.drawerState.close()};onHandleClick=()=>{this.drawerState&&this.drawerState.cycleSnapPoint()};onHandleKeyDown=t=>{this.drawerState&&(t.key==="ArrowUp"?(t.preventDefault(),this.drawerState.stepSnapPoint("up")):t.key==="ArrowDown"&&(t.preventDefault(),this.drawerState.stepSnapPoint("down")))};onLightDismiss=t=>{if(t.target===this.dialog){let e=this.dialog.getBoundingClientRect();(t.clientY<e.top||t.clientY>e.bottom||t.clientX<e.left||t.clientX>e.right)&&this.drawerState.close()}};open(){this.drawerState.open()}close(){this.drawerState.close()}};customElements.get("bs-dialog")||customElements.define("bs-dialog",n);export{r as BsButton,n as BsDialog};
