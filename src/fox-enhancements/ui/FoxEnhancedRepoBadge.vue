<script setup lang="ts">
import FeGithub from '@/components/Icons/FeGithub.vue';

import FoxEnhancedBadge from './FoxEnhancedBadge.vue';
import FoxEnhancedBadgeBase from './FoxEnhancedBadgeBase.vue';

withDefaults(
  defineProps<{
    href: string;
    scheme?: 'special' | 'standard';
  }>(),
  {
    scheme: 'standard',
  },
);
</script>

<template>
  <FoxEnhancedBadge v-if="scheme === 'special'" :href="href">
    <template #icon>
      <FeGithub />
    </template>
    Repository
  </FoxEnhancedBadge>

  <FoxEnhancedBadgeBase
    v-else
    :href="href"
    surface="rgba(41, 77, 115, 0.9)"
    border-color="rgba(162, 189, 218, 0.22)"
    text-color="var(--white)"
  >
    <template #icon>
      <FeGithub />
    </template>
    Repository
  </FoxEnhancedBadgeBase>
</template>
