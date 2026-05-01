import { html } from 'lit';
import '@bottomsheet-dialog/element';
// Wait, we can just import '@bottomsheet-dialog/element' to execute the customElements.define

import type { Meta, StoryObj } from '@storybook/web-components';

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) => html`<cq-button label="${args.label}"></cq-button>`,
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: 'Click Me!',
  },
};
