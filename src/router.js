import { createRouter, createWebHistory } from 'vue-router';

import EmptyPage from './components/pages/EmpyPage.vue'
import RegisterPage from './components/pages/RegisterPage.vue'
import AllPhotos from './components/pages/AllPhotos.vue'

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
  {
    path: '/photos',
    name: 'Photos',
    component: AllPhotos,
  },

  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
