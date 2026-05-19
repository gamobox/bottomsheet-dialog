# Bottomsheet Dialog UI

A modern, highly performant, and accessible UI component library built on Web Standards (Web Components).

## Features

- **Framework Agnostic**: Works perfectly with React, Vue, Svelte, Angular, or Vanilla JS without locking you into a specific ecosystem.
- **High Performance**: Employs CSS-variable-driven animations to minimize JavaScript main-thread blocking, ensuring 60fps animations.
- **Accessibility First**: Full support for keyboard navigation (ARIA), Forced Colors Mode (High Contrast), and `prefers-reduced-motion`.
- **Modern Web APIs**: Built on top of native elements like `<dialog>` and modern CSS features like `@starting-style`.

## Packages

This repository is managed as a monorepo using `pnpm` workspaces.

| Package | Description |
|---|---|
| [`@bottomsheet-dialog/core`](./packages/core) | Framework-agnostic core logic and state management (e.g., Drawer logic, Drag controllers). |
| [`@bottomsheet-dialog/element`](./packages/element) | Web Components wrapping the core logic to provide ready-to-use UI elements. |
| [`@bottomsheet-dialog/react`](./packages/react) | React wrapper for the Bottom Sheet web components. |
| [`@bottomsheet-dialog/vue`](./packages/vue) | Vue wrapper for the Bottom Sheet web components. |

## Components

### `<bs-dialog>` (Bottom Sheet)
A highly sophisticated, accessible, and performant Bottom Sheet (Half Modal) component with snap points, velocity swiping, and keyboard support.
👉 **[Read the detailed documentation for `<bs-dialog>`](./docs/bs-dialog.md)**

### `<bs-button>`
A standard, accessible Web Component button.

## Tech Stack

- **Package Manager**: `pnpm` (v9+)
- **Build Tool**: `tsup`
  - Used for building packages into ESM (`.js`), CJS (`.cjs`), and CDN-ready IIFE (`.global.js`) formats.
- **Testing Framework**: `vitest`
  - Used for workspace-wide testing.
- **Linter**: `oxlint`
  - Used for ultra-fast static analysis.
- **CI/CD & Releases**: `GitHub Actions` + `Changesets`
  - CI (lint, test, build) and Release workflows are configured.

## Development Setup

```bash
# Install dependencies
pnpm install

# Start Storybook for local development & documentation
pnpm --filter @bottomsheet-dialog/storybook run storybook

# Build all packages (generates ESM, CJS, and IIFE formats)
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Architecture & Philosophy

The project intentionally separates **Core Logic** (`@bottomsheet-dialog/core`) from **UI Rendering** (`@bottomsheet-dialog/element`).
This allows the core logic (such as velocity calculation, state management, and gesture handling) to be entirely independent of the DOM implementation. This not only makes the code highly testable but also makes it easy to adapt the core interactions into other non-Web Component environments if needed.
