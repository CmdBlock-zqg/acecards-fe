import { createApp } from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router.js'

createApp(App).use(router).use(Vant).mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then((reg) => {
    console.log('ServiceWorker registered. ' + reg.scope);
  }).catch(function(error) {
    console.log('ServiceWorker registration failed with ' + error);
  })
}