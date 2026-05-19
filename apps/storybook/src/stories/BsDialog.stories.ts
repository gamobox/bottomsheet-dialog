import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@bottomsheet-dialog/element';

import type { Meta, StoryObj } from '@storybook/web-components';

const meta = {
  title: 'Components/BsDialog',
  tags: ['autodocs'],

  argTypes: {
    persistKey: { control: 'text' },
    snapPoints: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="font-family: system-ui, sans-serif; padding: 20px;">
      <h2>Bottom Sheet (Half Modal)</h2>
      <p>Click the button below to open the bottom sheet.</p>
      
      <button 
        style="padding: 10px 16px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
        onclick="document.getElementById('demo-bs-dialog').open()"
      >
        Open Bottom Sheet
      </button>

      <bs-dialog 
        id="demo-bs-dialog" 
        persist-key=${ifDefined(args.persistKey)}
      >
        <div style="font-family: system-ui, sans-serif; padding: 0 8px 24px;">
          <h2 style="margin-top: 0;">Bottom Sheet Content</h2>
          <p>This is a native dialog styled as a bottom sheet. Try dragging the handle at the top to close it.</p>
          <p>Because it uses the native <code>&lt;dialog&gt;</code> element, it provides:</p>
          <ul>
            <li>Automatic focus trapping</li>
            <li>Close on ESC key</li>
            <li>Top layer promotion</li>
          </ul>
          
          <p>You can also dismiss it by clicking on the background (Light dismiss).</p>

          <div style="margin-top: 24px; padding: 16px; border: 1px solid #eaeaea; border-radius: 8px; height: 150px; overflow-y: auto;">
            <h3 style="margin-top: 0;">Scrollable Area</h3>
            <p>If you scroll down here, dragging the sheet is prevented.</p>
            <p>If you scroll all the way to the top and drag down, the sheet will close.</p>
            <p>Line 1</p>
            <p>Line 2</p>
            <p>Line 3</p>
            <p>Line 4</p>
            <p>Line 5</p>
            <p>Line 6</p>
            <p>Line 7</p>
            <p>Line 8</p>
          </div>

          <button 
            style="margin-top: 24px; padding: 10px 16px; background: #e0e0e0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
            onclick="document.getElementById('demo-bs-dialog').close()"
          >
            Close Dialog Programmatically
          </button>
        </div>
      </bs-dialog>
    </div>
  `,
  args: {
    persistKey: 'demo-bs-dialog-state',
  },
};

export const WithSnapPoints: Story = {
  render: (args) => html`
    <div style="font-family: system-ui, sans-serif; padding: 20px;">
      <h2>Bottom Sheet (With Snap Points)</h2>
      <p>This drawer has snap points defined: ${args.snapPoints || 'none'}.</p>
      
      <button 
        style="padding: 10px 16px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
        onclick="document.getElementById('snap-bs-dialog').open()"
      >
        Open Drawer
      </button>

      <bs-dialog 
        id="snap-bs-dialog" 
        snap-points=${ifDefined(args.snapPoints)}
      >
        <div style="font-family: system-ui, sans-serif; padding: 0 8px 24px; min-height: 80vh;">
          <h2 style="margin-top: 0;">Snap Points Demo</h2>
          <p>This drawer stops at 50% and 100% of its max height.</p>
          <p>Drag the handle at the top to move between states.</p>
          
          <div style="margin-top: 40px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h3>Content Area</h3>
            <p>If you drag quickly downwards, it will close.</p>
            <p>If you drag slowly, it will snap to the nearest point (0.5 or 0).</p>
          </div>
        </div>
      </bs-dialog>
    </div>
  `,
  args: {
    snapPoints: "0.3, 0.8, 1",
  },
};
