export interface FoxEnhancementModule {
  id: string;
  label: string;
}

const activeModules = new Map<string, FoxEnhancementModule>();

export function registerFoxEnhancementModule(module: FoxEnhancementModule) {
  activeModules.set(module.id, module);
}

export function getFoxEnhancementModules() {
  return [...activeModules.values()];
}
