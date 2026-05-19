import React, { forwardRef } from 'react';
import '@bottomsheet-dialog/element';

export interface BsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Add any custom props if needed
}

export const BsButton = forwardRef<HTMLElement, BsButtonProps>(({ children, ...props }, ref) => {
  return React.createElement(
    'bs-button',
    {
      ref,
      ...props,
    },
    children
  );
});

BsButton.displayName = 'BsButton';
