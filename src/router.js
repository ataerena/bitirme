import { createRouter, createWebHistory } from 'vue-router';

import EmptyPage from './components/pages/EmpyPage.vue'
import RegisterPage from './components/pages/RegisterPage.vue'

const routes = [
  {
    path: '/empty',
    name: 'empty',
    component: EmptyPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
