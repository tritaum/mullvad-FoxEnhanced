<script setup lang="ts">
import { NCard, NTag } from 'naive-ui';

import FeGithub from '@/components/Icons/FeGithub.vue';
import FeInfo from '@/components/Icons/FeInfo.vue';

import { version } from '@/helpers/browserExtension';
import { foxEnhancedPatchVersion } from '@/forkMetadata';
</script>

<template>
  <div class="flex items-center p-3 pb-1">
    <n-tag round :bordered="false" type="info" class="mr-4">
      FoxEnhanced Patches Version: {{ foxEnhancedPatchVersion }}
      <template #icon>
        <FeInfo />
      </template>
    </n-tag>
    <n-tag round :bordered="false" type="info">
      <a href="https://github.com/mullvad/browser-extension"> Upstream source </a>
      <template #icon>
        <FeGithub />
      </template>
    </n-tag>
  </div>

  <n-card class="mt-4">
    <p>Mullvad Extension version: {{ version }} (latest)</p>

    <p class="mt-3">
      Mullvad FoxEnhanced is an unofficial community patch set on top of the Mullvad Browser
      Extension. The main branch is intended to stay aligned with the latest official upstream
      updates, with FoxEnhanced changes layered on top as a focused set of patches.
    </p>

    <p>
      It keeps the upstream defaults by default, and any new fork-specific functionality should be
      manually enabled and configured by the user.
    </p>

    <p class="mt-3">
      This fork is licensed
      <a href="../../LICENSE.md"> GPLv3+</a>
      except for the parts specified below:
    </p>

    <ul list="disc inside" class="py-2">
      <li>
        Open Sans -
        <a href="http://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>
      </li>
      <li>
        Source Sans Pro -
        <a href="https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL">
          Open Font License
        </a>
      </li>
      <li>
        Feather Icon -
        <a href="https://github.com/feathericon/feathericon/blob/master/LICENSE"> MIT </a>
      </li>
    </ul>
    <p>Third party extensions logos are the property of their respective owners.</p>
  </n-card>
</template>
