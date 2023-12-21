// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    // Your state properties
  },
  mutations: {
    // Your mutations
  },
  actions: {
    logout() {
      localStorage.setItem('token', '');
      window.location.reload();
    },
  },
});
