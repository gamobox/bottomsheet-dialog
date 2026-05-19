import { defineComponent, h } from 'vue';
import '@bottomsheet-dialog/element';

export const BsButton = defineComponent({
  name: 'BsButton',
  setup(_, { slots }) {
    return () => h('bs-button', null, slots.default?.());
  }
});
