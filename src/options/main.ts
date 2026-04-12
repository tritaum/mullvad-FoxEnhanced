import { createApp } from 'vue';
import App from './App.vue';
import '../styles';
import { runOptionsBootstrapHooks } from '@/fox-enhancements/bootstrap';

async function bootstrap() {
  const app = createApp(App);
  await runOptionsBootstrapHooks(app);
  app.mount('#app');
}

void bootstrap();
