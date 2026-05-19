"use strict";var CaiqueElement=(()=>{var h=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var v=Object.getOwnPropertyNames;var P=Object.prototype.hasOwnProperty;var m=(t,e)=>{for(var i in e)h(t,i,{get:e[i],enumerable:!0})},w=(t,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of v(e))!P.call(t,n)&&n!==i&&h(t,n,{get:()=>e[n],enumerable:!(s=b(e,n))||s.enumerable});return t};var f=t=>w(h({},"__esModule",{value:!0}),t);var y={};m(y,{BsButton:()=>r,BsDialog:()=>l});var g=class{_isOn=!1;listeners=new Set;get isOn(){return this._isOn}toggle(){this._isOn=!this._isOn,this.notify()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t(this._isOn))}},u=class{_isOpen;persistKey;storageType;snapPoints=[];activeSnapPointIndex=-1;onStateChange;onSnapPointChange;constructor(t={}){this.persistKey=t.persistKey,this.storageType=t.storage||"session",this.onStateChange=t.onStateChange,this.onSnapPointChange=t.onSnapPointChange,t.snapPoints&&t.snapPoints.length>0&&(this.snapPoints=[...t.snapPoints].sort((i,s)=>i-s),this.activeSnapPointIndex=0);let e=this.loadState();this._isOpen=e!==null?e:t.isOpen||!1,this._isOpen&&this.snapPoints.length>0&&this.onSnapPointChange?.(this.snapPoints[this.activeSnapPointIndex],this.activeSnapPointIndex)}get isOpen(){return this._isOpen}get hasSnapPoints(){return this.snapPoints.length>0}get allSnapPoints(){return this.snapPoints}get currentSnapPoint(){return this.hasSnapPoints?this.snapPoints[this.activeSnapPointIndex]:1}open(){this.setOpen(!0),this.hasSnapPoints&&(this.activeSnapPointIndex=0,this.onSnapPointChange?.(this.snapPoints[0],0))}close(){this.setOpen(!1)}toggle(){this._isOpen?this.close():this.open()}setSnapPointIndex(t){!this.hasSnapPoints||t<0||t>=this.snapPoints.length||(this.activeSnapPointIndex=t,this.onSnapPointChange?.(this.snapPoints[t],t))}setSnapPoints(t){this.snapPoints=[...t].sort((e,i)=>e-i),this.hasSnapPoints?this.activeSnapPointIndex>=this.snapPoints.length?this.setSnapPointIndex(this.snapPoints.length-1):this.activeSnapPointIndex===-1&&this.setSnapPointIndex(0):this.activeSnapPointIndex=-1}cycleSnapPoint(){if(!this.hasSnapPoints)return;let t=(this.activeSnapPointIndex+1)%this.snapPoints.length;this.setSnapPointIndex(t)}stepSnapPoint(t){if(this.hasSnapPoints)if(t==="up"){let e=Math.min(this.snapPoints.length-1,this.activeSnapPointIndex+1);this.setSnapPointIndex(e)}else this.activeSnapPointIndex===0?this.close():this.setSnapPointIndex(this.activeSnapPointIndex-1)}setOpen(t){this._isOpen!==t&&(this._isOpen=t,this.saveState(),this.onStateChange?.(t))}getStorage(){return typeof window>"u"?null:this.storageType==="local"?window.localStorage:window.sessionStorage}loadState(){if(!this.persistKey)return null;let t=this.getStorage();if(!t)return null;let e=t.getItem(this.persistKey);return e==="true"?!0:e==="false"?!1:null}saveState(){if(!this.persistKey)return;let t=this.getStorage();t&&t.setItem(this.persistKey,String(this._isOpen))}},S=class{element;dialog;onClose;snapPoints;onSnap;dragHandleSelector;onDragStart;onDragEnd;isDragging=!1;startY=0;currentY=0;startTime=0;activePointerId=null;startSnap=1;currentSnap=1;dialogHeight=0;constructor(t){this.element=t.element,this.dialog=t.dialog,this.onClose=t.onClose,this.snapPoints=t.snapPoints||[],this.onSnap=t.onSnap,this.dragHandleSelector=t.dragHandleSelector||".drag-handle",this.onDragStart=t.onDragStart,this.onDragEnd=t.onDragEnd,this.attach()}attach(){this.element.addEventListener("pointerdown",this.onPointerDown),window.addEventListener("pointermove",this.onPointerMove,{passive:!1}),window.addEventListener("pointerup",this.onPointerUp),window.addEventListener("pointercancel",this.onPointerCancel)}detach(){this.element.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("pointerup",this.onPointerUp),window.removeEventListener("pointercancel",this.onPointerCancel)}setSnapPoints(t){this.snapPoints=t}onPointerDown=t=>{if(t.button!==0||this.isDragging)return;let e=t.target;if(t.pointerType!=="touch"&&!e.closest(this.dragHandleSelector)||e.scrollHeight>e.clientHeight&&e.scrollTop>0||window.getSelection()?.toString().length)return;this.isDragging=!0,this.activePointerId=t.pointerId,this.startY=t.clientY,this.currentY=t.clientY,this.startTime=performance.now(),this.dialogHeight=this.dialog.getBoundingClientRect().height;let i=this.dialog.style.getPropertyValue("--snap-point");this.startSnap=i?parseFloat(i):1,this.currentSnap=this.startSnap,this.element.setPointerCapture(t.pointerId),this.dialog.style.transition="none",this.onDragStart?.()};onPointerMove=t=>{if(!this.isDragging||t.pointerId!==this.activePointerId)return;t.preventDefault(),this.currentY=t.clientY;let e=this.currentY-this.startY,i=this.dialogHeight*(1-this.startSnap)+e,s=this.snapPoints.length>0?Math.max(...this.snapPoints):1,n=this.dialogHeight*(1-s);i<n&&(i=n-Math.sqrt(n-i)*2),this.currentSnap=1-i/this.dialogHeight,this.dialog.style.setProperty("--snap-point",this.currentSnap.toString())};onPointerUp=t=>{!this.isDragging||t.pointerId!==this.activePointerId||this.endDrag(t.clientY)};onPointerCancel=t=>{!this.isDragging||t.pointerId!==this.activePointerId||this.abortDrag()};endDrag(t){this.isDragging=!1,this.activePointerId=null;let e=t-this.startY,i=performance.now()-this.startTime,s=e/i;this.dialog.style.transition="";let n=0,o=this.snapPoints.length>0?[...this.snapPoints,0]:[1,0],a=s*-.2,d=this.currentSnap+a;n=o.reduce((p,c)=>Math.abs(c-d)<Math.abs(p-d)?c:p),n===0?this.onClose():this.onSnap?this.onSnap(n):this.dialog.style.setProperty("--snap-point",n.toString()),this.currentY=0,this.onDragEnd?.()}abortDrag(){this.isDragging=!1,this.activePointerId=null,this.dialog.style.transition="",this.dialog.style.setProperty("--snap-point",this.startSnap.toString()),this.currentY=0,this.onDragEnd?.()}getScrollParent(t){if(!t||t===this.element)return null;let e=t.scrollHeight>t.clientHeight,i=window.getComputedStyle(t).overflowY;return e&&(i==="auto"||i==="scroll")?t:this.getScrollParent(t.parentElement)}};var r=class extends HTMLElement{state;unsubscribe;constructor(){super(),this.attachShadow({mode:"open"}),this.state=new g;let e=document.createElement("style");e.textContent=`
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
    `;let i=document.createElement("button");i.textContent=this.getAttribute("label")||"Toggle",i.addEventListener("click",()=>{this.state.toggle()}),this.shadowRoot?.append(e,i),this.unsubscribe=this.state.subscribe(s=>{s?(i.classList.add("active"),i.textContent="Active"):(i.classList.remove("active"),i.textContent=this.getAttribute("label")||"Toggle")})}disconnectedCallback(){this.unsubscribe()}};customElements.define("cq-button",r);var l=class extends HTMLElement{dialog;dragHandle;drawerState;dragController;constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["open","persist-key","snap-points"]}connectedCallback(){this.render(),this.setupLogic()}disconnectedCallback(){this.dragController?.detach(),this.dialog?.removeEventListener("close",this.onDialogClose),this.dialog?.removeEventListener("click",this.onLightDismiss),this.dragHandle?.removeEventListener("click",this.onHandleClick),this.dragHandle?.removeEventListener("keydown",this.onHandleKeyDown)}attributeChangedCallback(e,i,s){if(e==="open"&&this.drawerState&&(s!==null&&!this.drawerState.isOpen?this.drawerState.open():s===null&&this.drawerState.isOpen&&this.drawerState.close()),e==="snap-points"){let n=s?s.split(",").map(o=>parseFloat(o.trim())).filter(o=>!isNaN(o)):[1];this.drawerState&&this.drawerState.setSnapPoints(n),this.dragController&&this.dragController.setSnapPoints(n)}}render(){this.shadowRoot.innerHTML=`
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
    `,this.dialog=this.shadowRoot.querySelector("dialog"),this.dragHandle=this.shadowRoot.querySelector(".drag-handle")}setupLogic(){let e=this.getAttribute("persist-key")||void 0,i=this.hasAttribute("open"),s=this.getAttribute("snap-points"),n=s?s.split(",").map(o=>parseFloat(o.trim())).filter(o=>!isNaN(o)):[1];this.drawerState=new u({isOpen:i,persistKey:e,snapPoints:n,onStateChange:o=>{o?(document.body.style.setProperty("overflow","hidden"),this.dialog.open||this.dialog.showModal(),this.hasAttribute("open")||this.setAttribute("open",""),this.dispatchEvent(new CustomEvent("open",{bubbles:!0,composed:!0}))):(document.querySelectorAll("bs-dialog[open]").length<=1&&document.body.style.removeProperty("overflow"),this.dialog.open&&this.dialog.close(),this.hasAttribute("open")&&this.removeAttribute("open"),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0})))},onSnapPointChange:(o,a)=>{this.dialog.style.setProperty("--snap-point",o.toString()),this.dispatchEvent(new CustomEvent("snap-change",{detail:{point:o,index:a},bubbles:!0,composed:!0}))}}),this.dragController=new S({element:this.dialog,dialog:this.dialog,snapPoints:n,onSnap:o=>{let a=this.drawerState.allSnapPoints.indexOf(o);a!==-1&&this.drawerState.setSnapPointIndex(a)},onClose:()=>{this.drawerState.close()},onDragStart:()=>{this.dispatchEvent(new CustomEvent("drag-start",{bubbles:!0,composed:!0}))},onDragEnd:()=>{this.dispatchEvent(new CustomEvent("drag-end",{bubbles:!0,composed:!0}))}}),this.dialog.addEventListener("close",this.onDialogClose),this.dialog.addEventListener("click",this.onLightDismiss),this.dragHandle.addEventListener("click",this.onHandleClick),this.dragHandle.addEventListener("keydown",this.onHandleKeyDown),this.drawerState.isOpen&&!this.dialog.open&&(this.dialog.showModal(),this.hasAttribute("open")||this.setAttribute("open",""))}onDialogClose=()=>{this.drawerState.isOpen&&this.drawerState.close()};onHandleClick=()=>{this.drawerState&&this.drawerState.cycleSnapPoint()};onHandleKeyDown=e=>{this.drawerState&&(e.key==="ArrowUp"?(e.preventDefault(),this.drawerState.stepSnapPoint("up")):e.key==="ArrowDown"&&(e.preventDefault(),this.drawerState.stepSnapPoint("down")))};onLightDismiss=e=>{if(e.target===this.dialog){let i=this.dialog.getBoundingClientRect();(e.clientY<i.top||e.clientY>i.bottom||e.clientX<i.left||e.clientX>i.right)&&this.drawerState.close()}};open(){this.drawerState.open()}close(){this.drawerState.close()}};customElements.get("bs-dialog")||customElements.define("bs-dialog",l);return f(y);})();
