<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const props = withDefaults(
  defineProps<{
    borderColor?: string;
    gradient?: string;
    href?: string;
    iconSize?: string;
    surface?: string;
    textColor?: string;
  }>(),
  {
    borderColor: 'rgba(162, 189, 218, 0.2)',
    gradient: undefined,
    href: undefined,
    iconSize: '0.875rem',
    surface: 'rgba(25, 46, 69, 0.92)',
    textColor: 'var(--white)',
  },
);

const attrs = useAttrs();

const componentTag = computed(() => (props.href ? 'a' : 'span'));

const badgeStyle = computed(() => ({
  background: props.gradient ?? props.surface,
  borderColor: props.borderColor,
  color: props.textColor,
}));
</script>

<template>
  <component
    :is="componentTag"
    class="fox-badge"
    :href="href"
    :style="badgeStyle"
    v-bind="attrs"
  >
    <span v-if="$slots.icon" class="fox-badge-icon" :style="{ width: iconSize, height: iconSize }">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>

<style scoped>
.fox-badge {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 8px;
  box-sizing: border-box;
  color: var(--white);
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 600;
  gap: 0.4rem;
  line-height: 1.25rem;
  max-width: 100%;
  padding: 0.42rem 0.75rem;
  text-decoration: none;
}

.fox-badge-icon {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  justify-content: center;
}

.fox-badge-icon :deep(svg) {
  height: 100%;
  width: 100%;
}
</style>
