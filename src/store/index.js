import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		authenticated: false,
		activeProjectType: null, //string
		projectTypes: [],
		projectFields: {},
		projectLists: {},
		filters: [],
		templateEditor: {
			layout: null,
			field: null,
		}
	},
	mutations: {
		SET_AUTH: function (state, pkg) {
			if (pkg) {
				state.authenticated = true;
			}
			state.authenticated = true;
		},
		SET_TYPES: function (state, pkg) {
			state.projectTypes = pkg;
		},
		UPDATE_ACTIVE_TYPE: function(state, type) {
			state.activeProjectType = type;
		},
		LOADING_LIST: function (state, type) {
			let currentList = state.projectLists[type] || {};
			let newList = {
				...currentList,
				loading: true
			};
			Vue.set(state.projectLists, type, newList);
		},
		SET_LIST: function (state, pkg) {
			Vue.set(state.projectLists, pkg.type, {
				loading: false,
				lastUpdate: Date.now(),
				list: pkg.list
			});
		},
		LOADING_FIELDS: function (state, type) {
			let currentFields = state.projectFields[type] || {};
			let newList = {
				...currentFields,
				loading: true
			};
			Vue.set(state.projectFields, type, newList);
		},
		SET_FIELDS: function (state, pkg) {
			Vue.set(state.projectFields, pkg.type, {
				loading: false,
				lastUpdate: Date.now(),
				fields: pkg.fields
			});
		},
		EDIT_FIELD: function (state, field) {
			state.templateEditor.field = field;
		},
		PUSH_FIELD: function(state, field) {
			console.log(state, field);
		}
	},
	actions: {
		getTypes({ commit }) {
			axios.get("/api/types")
				.then(result => {
					commit('SET_TYPES', result.data.types);
				});
		},
		getProjectList({ commit }, type) {
			const searchType = this.state.projectTypes.find(x => x.codename == type);
			if (searchType == null) return;
			commit('LOADING_LIST', type);
			axios.get(`/api/projects?type=${searchType.id}`)
				.then(result => {
					console.log(result.data);
					commit('SET_LIST', {
						type,
						list: result.data.list
					});
				});
		},
		getProjectFields({ commit }, type) {
			const searchType = this.state.projectTypes.find(x => x.codename == type);
			if (searchType == null) return;
			commit('LOADING_FIELDS', type);
			axios.get(`/api/types/${searchType.id}/fields`)
				.then(result => {
					commit('SET_FIELDS', {
						type,
						fields: result.data.fields
					});
				});
		},
		createField({ commit }, pkg) {
			console.log(this.getters.activeType, pkg);
			return axios.post(`/api/types/${this.getters.activeType.id}/fields`, pkg)
				.then(result => {
					console.log(result);
					commit('PUSH_FIELD', result);
					return result;
				})
		}
	},
	getters: {
		activeList: state => {
			if (state.projectLists[state.activeProjectType]) {
				return state.projectLists[state.activeProjectType];
			}
			return {};
		},
		activeFields: state => {
			if (state.projectFields[state.activeProjectType]) {
				return state.projectFields[state.activeProjectType];
			}
			return {};
		},
		activeType: state => {
			const t = state.projectTypes.find(x => x.codename == state.activeProjectType);
			return t || {};
		}
	},
	modules: {
	}
})