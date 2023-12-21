import { createRouter, createWebHistory } from 'vue-router';

import EmptyPage from './components/pages/EmpyPage.vue'

const routes = [
  {
    path: '/empty',
    name: 'empty',
    component: EmptyPage,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
