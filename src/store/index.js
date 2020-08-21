import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: false,
    projectTypes: [],
    filters: [],
    activeList: []
  },
  mutations: {
    SET_AUTH: function(state, pkg) {
      if (pkg) {
        state.authenticated = true;
      }
      state.authenticated = true;
    },
    SET_TYPES: function(state, pkg) {
      state.projectTypes = pkg;
    },
    SET_LIST: function(state, pkg) {
      state.activeList = pkg;
    }
  },
  actions: {
    getTypes({commit}) {
      axios.get("/api/types")
        .then( result => {
          console.log(result.data);
          commit('SET_TYPES', result.data.types);
        });
    },
    getProjectList({commit}, type) {
      const searchType = this.state.projectTypes.find(x => x.codename == type);
      if (searchType == null) return;
      axios.get(`/api/projects?type=${searchType.id}`)
        .then(result => {
          console.log(result.data);
          commit('SET_LIST', result.data.list);
        });
    }

  },
  modules: {
  }
})
