import { huntflow } from '@huntflow/eslint-config';

export default huntflow({
  stylistic: {
    indent: 2
  },
  vue: {
    overrides: {
      'vue/custom-event-name-casing': 'off',
      'eslintvue/custom-event-name-casing': 'off'
    }
  }
});
