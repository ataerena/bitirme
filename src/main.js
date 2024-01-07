import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store/index';
import mitt from 'mitt';

import vueAwesomeSidebar  from 'vue-awesome-sidebar'
import ToastPlugin from 'vue-toast-notification';

import 'vue-awesome-sidebar/dist/vue-awesome-sidebar.css'
import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'vue-toast-notification/dist/theme-bootstrap.css';


const app = createApp(App)
const emitter = mitt();

app.config.globalProperties.$emitter = emitter;

app.use(router)
app.use(store)

app.use(ToastPlugin);
app.use(vueAwesomeSidebar)

app.mount("#app")