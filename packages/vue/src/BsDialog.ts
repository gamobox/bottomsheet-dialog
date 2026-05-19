import { defineComponent, h, ref, onMounted, onBeforeUnmount, PropType } from 'vue';
import '@bottomsheet-dialog/element';

export const BsDialog = defineComponent({
  name: 'BsDialog',
  props: {
    open: {
      type: Boolean,
      default: undefined
    },
    persistKey: {
      type: String,
      default: undefined
    },
    snapPoints: {
      type: [String, Array] as PropType<string | number[]>,
      default: undefined
    }
  },
  emits: ['open', 'close', 'snap-change', 'drag-start', 'drag-end'],
  setup(props, { emit, slots, expose }) {
    const elRef = ref<HTMLElement | null>(null);

    const handleOpen = (e: Event) => emit('open', e);
    const handleClose = (e: Event) => emit('close', e);
    const handleSnapChange = (e: Event) => emit('snap-change', (e as CustomEvent).detail);
    const handleDragStart = (e: Event) => emit('drag-start', e);
    const handleDragEnd = (e: Event) => emit('drag-end', e);

    onMounted(() => {
      const el = elRef.value;
      if (el) {
        el.addEventListener('open', handleOpen);
        el.addEventListener('close', handleClose);
        el.addEventListener('snap-change', handleSnapChange);
        el.addEventListener('drag-start', handleDragStart);
        el.addEventListener('drag-end', handleDragEnd);
      }
    });

    onBeforeUnmount(() => {
      const el = elRef.value;
      if (el) {
        el.removeEventListener('open', handleOpen);
        el.removeEventListener('close', handleClose);
        el.removeEventListener('snap-change', handleSnapChange);
        el.removeEventListener('drag-start', handleDragStart);
        el.removeEventListener('drag-end', handleDragEnd);
      }
    });

    expose({
      open: () => (elRef.value as any)?.open(),
      close: () => (elRef.value as any)?.close()
    });

    return () => {
      const formattedSnapPoints = Array.isArray(props.snapPoints)
        ? props.snapPoints.join(',')
        : props.snapPoints;

      return h(
        'bs-dialog',
        {
          ref: elRef,
          'persist-key': props.persistKey,
          'snap-points': formattedSnapPoints,
          ...(props.open !== undefined ? { open: props.open ? '' : null } : {})
        },
        slots.default?.()
      );
    };
  }
});
