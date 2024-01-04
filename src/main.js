import { createApp } from 'vue'
import App from './App.vue'
import vueAwesomeSidebar  from 'vue-awesome-sidebar'
import 'vue-awesome-sidebar/dist/vue-awesome-sidebar.css'
import '@mdi/font/css/materialdesignicons.css'
import router from './router.js'
import store from './store/index';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';


const app = createApp(App)

app.use(ToastPlugin);
app.use(store)
app.use(vueAwesomeSidebar)
app.use(router)
app.mount("#app")