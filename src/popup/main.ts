import { createApp } from 'vue';
import App from './App.vue';
import '../styles';
import { runPopupBootstrapHooks } from '@/fox-enhancements/bootstrap';

async function bootstrap() {
  const app = createApp(App);
  await runPopupBootstrapHooks(app);
  app.mount('#app');
}

void bootstrap();
