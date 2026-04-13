import type { Component } from 'vue';

export interface FoxEnhancementOptionsTab {
  id: string;
  label: string;
  component: Component;
  order?: number;
}

const registeredOptionsTabs = new Map<string, FoxEnhancementOptionsTab>();

export function registerFoxEnhancementOptionsTab(tab: FoxEnhancementOptionsTab) {
  if (registeredOptionsTabs.has(tab.id)) {
    throw new Error(`FoxEnhanced options tab "${tab.id}" is already registered.`);
  }

  registeredOptionsTabs.set(tab.id, tab);
}

export function getFoxEnhancementOptionsTabs() {
  return [...registeredOptionsTabs.values()].sort((left, right) => {
    const orderDifference = (left.order ?? 0) - (right.order ?? 0);
    if (orderDifference !== 0) {
      return orderDifference;
    }

    return left.label.localeCompare(right.label);
  });
}

export function resetFoxEnhancementOptionsTabsForTesting() {
  registeredOptionsTabs.clear();
}
