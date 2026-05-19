import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import '@bottomsheet-dialog/element';

export interface BsDialogProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onDragStart' | 'onDragEnd'> {
  open?: boolean;
  persistKey?: string;
  snapPoints?: number[] | string;
  onOpen?: (event: Event) => void;
  onClose?: (event: Event) => void;
  onSnapChange?: (event: CustomEvent<{ point: number; index: number }>) => void;
  onDragStart?: (event: Event) => void;
  onDragEnd?: (event: Event) => void;
}

export interface BsDialogElement extends HTMLElement {
  open(): void;
  close(): void;
}

export const BsDialog = forwardRef<BsDialogElement, BsDialogProps>(
  (
    {
      open,
      persistKey,
      snapPoints,
      onOpen,
      onClose,
      onSnapChange,
      onDragStart,
      onDragEnd,
      children,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<BsDialogElement>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handleOpen = (e: Event) => onOpen?.(e);
      const handleClose = (e: Event) => onClose?.(e);
      const handleSnapChange = (e: Event) => onSnapChange?.(e as CustomEvent);
      const handleDragStart = (e: Event) => onDragStart?.(e);
      const handleDragEnd = (e: Event) => onDragEnd?.(e);

      el.addEventListener('open', handleOpen);
      el.addEventListener('close', handleClose);
      el.addEventListener('snap-change', handleSnapChange);
      el.addEventListener('drag-start', handleDragStart);
      el.addEventListener('drag-end', handleDragEnd);

      return () => {
        el.removeEventListener('open', handleOpen);
        el.removeEventListener('close', handleClose);
        el.removeEventListener('snap-change', handleSnapChange);
        el.removeEventListener('drag-start', handleDragStart);
        el.removeEventListener('drag-end', handleDragEnd);
      };
    }, [onOpen, onClose, onSnapChange, onDragStart, onDragEnd]);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      
      if (open !== undefined) {
        if (open) {
          el.setAttribute('open', '');
        } else {
          el.removeAttribute('open');
        }
      }
    }, [open]);

    const formattedSnapPoints = Array.isArray(snapPoints)
      ? snapPoints.join(',')
      : snapPoints;

    return React.createElement(
      'bs-dialog',
      {
        ref: innerRef,
        'persist-key': persistKey,
        'snap-points': formattedSnapPoints,
        ...(open ? { open: '' } : {}),
        ...props,
      },
      children
    );
  }
);

BsDialog.displayName = 'BsDialog';
