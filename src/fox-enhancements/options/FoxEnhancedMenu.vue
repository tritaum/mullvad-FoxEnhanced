<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { NCard, NFlex, NSwitch, NTag } from 'naive-ui';

import {
  getFoxEnhancementPatchStatuses,
  setFoxEnhancementPatchEnabled,
  subscribeToFoxEnhancementPatchStateChanges,
  type FoxEnhancementPatchStatus,
} from '../modules';

const patchStatuses = ref<FoxEnhancementPatchStatus[]>([]);
let unsubscribeFromPatchStateChanges: (() => void) | undefined;

async function refreshPatchStatuses() {
  patchStatuses.value = await getFoxEnhancementPatchStatuses();
}

async function togglePatch(patch: FoxEnhancementPatchStatus, enabled: boolean) {
  if (patch.required) {
    return;
  }

  await setFoxEnhancementPatchEnabled(patch.id, enabled);
}

const toggleablePatchCount = computed(() => patchStatuses.value.filter((patch) => !patch.required).length);

onMounted(async () => {
  await refreshPatchStatuses();

  unsubscribeFromPatchStateChanges = subscribeToFoxEnhancementPatchStateChanges(async () => {
    await refreshPatchStatuses();
  });
});

onBeforeUnmount(() => {
  unsubscribeFromPatchStateChanges?.();
  unsubscribeFromPatchStateChanges = undefined;
});
</script>

<template>
  <section class="fox-menu-shell">
    <n-card>
      <div class="fox-menu-header">
        <h2 class="fox-menu-title">FoxEnhanced Modules</h2>
        <p class="fox-menu-copy">
          Required modules stay enabled. Optional modules are disabled by default until you turn
          them on.
        </p>
        <n-flex size="small">
          <n-tag size="small" round :bordered="false" type="warning">
            {{ patchStatuses.length }} Registered
          </n-tag>
          <n-tag size="small" round :bordered="false" type="default">
            {{ toggleablePatchCount }} Optional
          </n-tag>
        </n-flex>
      </div>

      <div class="fox-menu-list">
        <section v-for="patch in patchStatuses" :key="patch.id" class="fox-menu-item">
          <div class="fox-menu-item-copy">
            <div class="fox-menu-item-heading">
              <h3 class="fox-menu-item-title">{{ patch.label }}</h3>
              <n-tag
                v-if="patch.required"
                size="small"
                round
                :bordered="false"
                type="warning"
                class="fox-menu-state-tag"
              >
                Required
              </n-tag>
              <n-tag
                v-else-if="patch.enabled"
                size="small"
                round
                :bordered="false"
                type="success"
                class="fox-menu-state-tag"
              >
                Enabled
              </n-tag>
              <n-tag
                v-else
                size="small"
                round
                :bordered="false"
                type="default"
                class="fox-menu-state-tag"
              >
                Disabled
              </n-tag>
            </div>

            <p v-if="patch.description" class="fox-menu-item-description">
              {{ patch.description }}
            </p>

            <n-flex size="small">
              <n-tag
                v-for="target in patch.targets"
                :key="target"
                size="small"
                round
                :bordered="false"
                type="info"
              >
                {{ target }}
              </n-tag>
            </n-flex>
          </div>

          <div class="fox-menu-item-action">
            <n-switch
              :value="patch.enabled"
              :disabled="patch.required"
              @update-value="togglePatch(patch, $event)"
            />
          </div>
        </section>
      </div>
    </n-card>
  </section>
</template>

<style scoped>
.fox-menu-shell {
  padding-top: 1rem;
}

.fox-menu-header {
  display: grid;
  gap: 0.75rem;
}

.fox-menu-title {
  color: var(--white);
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.fox-menu-copy {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.45;
  margin: 0;
}

.fox-menu-list {
  border-top: 1px solid rgba(162, 189, 218, 0.22);
  display: grid;
  margin-top: 1rem;
}

.fox-menu-item {
  align-items: center;
  border-top: 1px solid rgba(162, 189, 218, 0.14);
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 1rem 0;
}

.fox-menu-item:first-child {
  border-top: 0;
}

.fox-menu-item-copy {
  display: grid;
  gap: 0.5rem;
}

.fox-menu-item-heading {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.fox-menu-item-title {
  color: var(--white);
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0;
}

.fox-menu-item-description {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
  margin: 0;
}

.fox-menu-item-action {
  align-self: center;
}

@media (max-width: 640px) {
  .fox-menu-item {
    grid-template-columns: 1fr;
  }

  .fox-menu-item-action {
    justify-self: start;
  }
}
</style>
