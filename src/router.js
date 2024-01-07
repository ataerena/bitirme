import { createRouter, createWebHistory } from 'vue-router';

import RegisterPage from './components/pages/RegisterPage.vue';
import AllPhotos from './components/pages/AllPhotos.vue';
import FavoritePhotos from './components/pages/FavoritePhotos.vue';
import RestrictedPhotos from './components/pages/RestrictedPhotos.vue';
import AlbumPages from './components/pages/AlbumPage.vue';
import HomePage from './components/pages/HomePage.vue';


const routes = [
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
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritePhotos,
  },
  {
    path: '/restricted',
    name: 'Restricted',
    component: RestrictedPhotos,
  },
  {
    path: '/albums',
    name: 'Albums',
    component: AlbumPages,
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: HomePage,
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
