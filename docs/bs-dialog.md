# `<bs-dialog>` Bottom Sheet Dialog

A modern, accessible Bottom Sheet (Half Modal) component built on top of the native `<dialog>` element.

## 🌟 Key Features

### 1. Ultimate Performance (CSS Variable Driven)
Instead of updating `transform` styles via JavaScript on every frame, the drag gesture simply updates a single CSS variable (`--snap-point`).
The actual translation and backdrop opacity are handled entirely by native CSS `calc()`, guaranteeing extremely smooth, 60fps animations without layout thrashing.

### 2. Snap Points & Gestures
By providing a `snap-points` attribute, the bottom sheet can snap to various heights.
- **Velocity Detection**: Swiping down quickly will automatically calculate the velocity and dismiss the dialog, just like native mobile apps.
- **Rubber Banding**: Pulling the bottom sheet past its maximum height provides a natural resistance (rubber band effect).
- **Default Fallback**: If no snap points are provided, it automatically acts as a standard 0% to 100% modal with the same smooth gestures.

### 3. Device-Optimized Interactions
- **Touch Devices**: Users can swipe anywhere on the content area to drag the bottom sheet.
- **Mouse Environments**: Dragging is restricted to the top "Drag Handle". This ensures that users can select text within the content area without accidentally dragging the modal.

### 4. Accessibility (A11y)
- **Keyboard Navigation**: The drag handle acts as a `<button>`. Users can focus it via `Tab`, cycle through snap points using `Enter` or `Space`, and step smoothly using `ArrowUp` and `ArrowDown`.
- **Forced Colors Mode**: Fully supports Windows High Contrast mode by rendering explicit borders.
- **Reduced Motion**: Respects the user's `prefers-reduced-motion` OS setting by disabling transitions/animations, ensuring an instant, non-triggering appearance.
- **Scroll Locking**: Automatically locks the background `body` scroll when the dialog is open to prevent context loss.

### 5. Framework Integration (Custom Events)
Fires custom events that pierce the Shadow DOM (`composed: true`), making it easy to hook into frameworks like React or Vue.
- `open` / `close`: Fired when the dialog opens or closes.
- `drag-start` / `drag-end`: Fired when the user starts or stops dragging.
- `snap-change`: Fired when the snap point changes (`event.detail.point` and `event.detail.index`).

## 🛠 Usage

### Basic Usage (No Snap Points)
```html
<bs-dialog id="my-dialog">
  <h2>Settings</h2>
  <p>Here is some content...</p>
</bs-dialog>

<script>
  document.getElementById('my-dialog').open();
</script>
```

### With Snap Points
```html
<!-- Snaps to 30%, 60%, and 100% of its content height -->
<bs-dialog id="snap-dialog" snap-points="0.3, 0.6, 1">
  <div style="height: 800px; overflow-y: auto;">
    Long scrollable content...
  </div>
</bs-dialog>
```

## 🎨 Styling

The component uses Shadow DOM but exposes standard CSS variables for easy customization:

| CSS Variable | Description | Default Value |
|---|---|---|
| `--bs-dialog-bg` | Background color of the dialog | `#ffffff` |
| `--bs-dialog-radius` | Border radius for the top corners | `16px` |
| `--bs-dialog-padding` | Padding inside the content area | `16px` |

## 🧠 Architecture

The Bottom Sheet logic is highly decoupled to ensure testability and reusability:
- **`DrawerState`** (`@bottomsheet-dialog/core`): Manages the internal state (open/closed, current snap point index) and logic for stepping/cycling points.
- **`DragController`** (`@bottomsheet-dialog/core`): Handles pointer events, velocity tracking, and rubber banding mathematics.
- **`BsDialog`** (`@bottomsheet-dialog/element`): The Web Component wrapper that binds the core logic to the DOM and implements the CSS-variable-driven animations.
