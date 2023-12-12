import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import naive from 'naive-ui';
import router from './router';
import './styles/styles.scss';
import { createPinia } from 'pinia';

const pinia = createPinia()
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(naive);

app.mount('#app');
