import { addExtensionsListeners } from '@/helpers/extensions';
import { initProxyListeners } from '@/helpers/proxyListeners';
import { runBackgroundBootstrapHooks } from '@/fox-enhancements/bootstrap';

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client');
}

// Add listeners on extension actions
addExtensionsListeners();

// Add listeners for proxy actions
initProxyListeners();

// Run additive FoxEnhanced hooks after the upstream baseline is initialized.
void runBackgroundBootstrapHooks();
