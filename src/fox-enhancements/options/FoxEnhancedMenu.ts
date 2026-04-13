import { registerFoxEnhancementPatch } from '../modules';
import FoxEnhancedMenu from './FoxEnhancedMenu.vue';
import { registerFoxEnhancementOptionsTab } from './tabs';

registerFoxEnhancementOptionsTab({
  id: 'fox-enhanced',
  label: 'FoxEnhanced',
  component: FoxEnhancedMenu,
  order: 100,
});

registerFoxEnhancementPatch({
  id: 'fox-enhanced-menu',
  label: 'FoxEnhanced Menu',
  description: 'Adds the FoxEnhanced options tab and patch manager panel.',
  required: true,
  targets: ['options'],
  setup() {},
});
