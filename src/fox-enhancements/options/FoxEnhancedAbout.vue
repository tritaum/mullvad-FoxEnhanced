<script setup lang="ts">
import FeInfo from '@/components/Icons/FeInfo.vue';
import { version } from '@/helpers/browserExtension';

import FePuzzlePiece from '../components/FePuzzlePiece.vue';
import { foxEnhancementPatchVersion } from '../metadata';
import { getFoxEnhancementModules } from '../modules';
import FoxEnhancedBadge from '../ui/FoxEnhancedBadge.vue';
import FoxEnhancedBadgeBase from '../ui/FoxEnhancedBadgeBase.vue';
import FoxEnhancedCard from '../ui/FoxEnhancedCard.vue';
import FoxEnhancedRepoBadge from '../ui/FoxEnhancedRepoBadge.vue';

const activeModuleCount = getFoxEnhancementModules().length;
</script>

<template>
  <section class="fox-about-shell px-3 pb-3">
    <FoxEnhancedCard>
      <div class="fox-about-section">
        <h3 class="fox-about-title">Mullvad Extension</h3>
        <div class="fox-about-divider" />
        <div class="fox-about-row">
          <FoxEnhancedBadgeBase
            surface="rgba(41, 77, 115, 0.88)"
            border-color="rgba(162, 189, 218, 0.2)"
            text-color="var(--white)"
          >
            <template #icon>
              <FeInfo />
            </template>
            {{ version }}
          </FoxEnhancedBadgeBase>
          <FoxEnhancedRepoBadge
            href="https://github.com/mullvad/browser-extension"
            scheme="standard"
          />
        </div>
      </div>

      <div class="fox-about-section">
        <h3 class="fox-about-title">FoxEnhanced</h3>
        <div class="fox-about-divider fox-about-divider-fox" />
        <div class="fox-about-row">
          <FoxEnhancedBadge>
            <template #icon>
              <FeInfo />
            </template>
            {{ foxEnhancementPatchVersion }}
          </FoxEnhancedBadge>
          <FoxEnhancedBadge>
            <template #icon>
              <FePuzzlePiece />
            </template>
            {{ activeModuleCount }} Active modules
          </FoxEnhancedBadge>
        </div>
        <div class="fox-about-row fox-about-row-secondary">
          <FoxEnhancedRepoBadge
            href="https://github.com/tritaum/mullvad-foxenhanced"
            scheme="special"
          />
        </div>
      </div>
    </FoxEnhancedCard>
  </section>
</template>

<style scoped>
.fox-about-shell {
  margin-top: 0.25rem;
}

.fox-about-section + .fox-about-section {
  margin-top: 1.25rem;
}

.fox-about-title {
  color: var(--white);
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0;
}

.fox-about-divider {
  background: rgba(162, 189, 218, 0.26);
  height: 1px;
  margin-top: 0.5rem;
}

.fox-about-divider-fox {
  background: rgba(255, 213, 36, 0.3);
}

.fox-about-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.8rem;
}

.fox-about-row-secondary {
  margin-top: 0.6rem;
}
</style>
