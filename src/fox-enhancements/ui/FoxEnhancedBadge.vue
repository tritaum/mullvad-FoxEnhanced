<script setup lang="ts">
import FoxEnhancedBadgeBase from './FoxEnhancedBadgeBase.vue';

defineProps<{
  href?: string;
}>();
</script>

<template>
  <FoxEnhancedBadgeBase
    :href="href"
    gradient="linear-gradient(135deg, rgba(243, 122, 60, 0.34) 0%, rgba(224, 93, 72, 0.28) 42%, rgba(146, 90, 171, 0.26) 100%)"
    border-color="rgba(203, 140, 202, 0.22)"
    text-color="#fff4ef"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <slot />
  </FoxEnhancedBadgeBase>
</template>
