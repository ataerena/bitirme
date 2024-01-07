// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    searchTerm: '',
    searchResults: [],
  },
  mutations: {
    setSearchTerm(state, term) {
      state.searchTerm = term;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
    },
  },
  actions: {
    logout() {
      sessionStorage.clear();
      window.location.reload();
    },
    setSearchTerm({ commit }, term) {
      commit('setSearchTerm', term);
    },
    setSearchResults({ commit }, results) {
      commit('setSearchResults', results);
    },
  },
  getters: {
    getSearchTerm(state) {
      return state.searchTerm;
    },
    getSearchResults(state) {
      return state.searchResults;
    },
  },
});
