import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import vueAwesomeSidebar  from 'vue-awesome-sidebar'
import 'vue-awesome-sidebar/dist/vue-awesome-sidebar.css'
import '@mdi/font/css/materialdesignicons.css'
import router from './router.js'


const app = createApp(App)
app.use(vueAwesomeSidebar )
app.use(router)
app.mount("#app")