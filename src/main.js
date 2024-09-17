// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from "pinia";
import { IonicVue } from '@ionic/vue';

import router from './router';


/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Vue Date Picker css */
import '@vuepic/vue-datepicker/dist/main.css'

/* Theme variables */
import './theme/variables.css';
import BaseLayout from "@/components/base/BaseLayout.vue";

const app = createApp(App)
    .use(createPinia())
    .use(IonicVue)
    .use(router);

app.component('base-layout', BaseLayout);

router.isReady().then(() => {
  app.mount('#app');
});
