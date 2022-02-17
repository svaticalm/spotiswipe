import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';

// STYLES
import './assets/sass/style.sass';

createApp(App).use(store).use(router).mount('#app');
