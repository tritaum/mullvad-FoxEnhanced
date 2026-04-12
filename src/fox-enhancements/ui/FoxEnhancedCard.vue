<template>
  <div class="fox-card">
    <slot />
  </div>
</template>

<style scoped>
.fox-card {
  background: rgba(41, 77, 115, 0.5);
  border: 1px solid rgba(162, 189, 218, 0.18);
  border-radius: 8px;
  box-sizing: border-box;
  padding: 1rem 1rem 0.9rem;
}
</style>
