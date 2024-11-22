import { createApp } from 'vue';
import App from './App.vue'; // This should be your root component
import router from './authorized/router';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import 'quasar/src/css/index.sass';
import  piniaPluginPersistedstate  from 'pinia-plugin-persistedstate';
import i18next from 'i18next'
import i18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

fetch('http://localhost/lang/en').then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    
    i18next
        .use(LanguageDetector)
        .init({
            debug: true,
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: {} 
                }
            }
    });
    app.use(i18NextVue, { i18next })
    
});

app.use(pinia);
app.use(Quasar, { plugins: {}, config: {dark: "auto"} });
app.use(router);      
app.mount('#app');