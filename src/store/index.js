import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

import viewModes from "../data/viewModes";
import Layout from "@/models/class.layout";

export default new Vuex.Store({
	state: {
		authenticated: false,
		activeProjectType: null, //string

		activeProject: null,
		pendingUpdates: {},

		// objects to track various project data
		projectTypes: [],
		projectFields: {},
		projectLists: {},
		projectLayouts: {},

		viewModes: viewModes.VIEW,
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

		/* TYPES */
		SET_TYPES: function (state, pkg) {
			state.projectTypes = pkg;
		},
		UPDATE_ACTIVE_TYPE: function(state, type) {
			state.activeProjectType = type;
		},

		/* PROJECTS */
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


		/* FIELDS */
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

		EDIT_LAYOUT_FIELD: function (state, field) {
			state.templateEditor.field = field;
		},

		PUSH_FIELD: function(state, pkg) {
			const { type, field } = pkg;
			console.log(pkg, state.projectFields[type]);
			if (state.projectFields[type]) {
				let currentFields = state.projectFields[type];
				currentFields.fields.push(field);
				Vue.set(state.projectFields, type, currentFields);
			}
		},

		/* LAYOUTS */
		LOADING_LAYOUT: function (state, type) {
			let currentLayout = state.projectLayouts[type] || {};
			let newLayout = {
				...currentLayout,
				loading: true
			};
			Vue.set(state.projectLayouts, type, newLayout);
		},
		
		SET_LAYOUT: function (state, pkg) {
			Vue.set(state.projectLayouts, pkg.type, {
				loading: false,
				lastUpdate: Date.now(),
				layout: new Layout(pkg.layout)
			});
		},

		MODIFY_LAYOUT_AREA: function (state, pkg) {
			console.log(pkg);
			let currentLayout = state.projectLayouts[pkg.type].layout;
			Vue.set(currentLayout, pkg.areaName, pkg.area);
		},

		SET_RECORD: function(state, project) {
			state.activeProject = project;
		},

		UPDATE_FIELD(state, pkg) {
			Vue.set(state.pendingUpdates, pkg.id, pkg.value);
		},

		RESET_UPDATES(state) {
			state.pendingUpdates = {};
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
			console.log("getting fields");
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
			let typeName = this.state.activeProjectType;
			return axios.post(`/api/types/${this.getters.activeType.id}/fields`, pkg)
				.then(result => {
					let fieldPush = result.data.field;
					commit('PUSH_FIELD', { type: typeName, field: fieldPush}); // send field to the fieldList
					return fieldPush;
				});
		},
		getProjectLayout({ commit }, type) {
			const searchType = this.state.projectTypes.find(x => x.codename == type);
			console.log("get layout 2")
			if (searchType == null) return;
			commit('LOADING_LAYOUT', type);
			axios.get(`/api/types/${searchType.id}/layout`)
				.then(result => {
					commit('SET_LAYOUT', {
						type,
						layout: result.data.layout
					});
				});
		},
		saveLatestLayout(_, pkg) {
			return axios.post(`/api/types/${this.getters.activeType.id}/layout`, pkg)
				.then(result => {
					console.log(result.data);
					return result.data;
				})
		},
		getProjectRecord({ commit }, id) {
			return axios.get(`/api/projects/${id}`)
				.then(response => {
					commit('SET_RECORD', response.data.project);
					return true;
				});
		},

		updateProject({ commit }) {
			let fields = Object.keys(this.state.pendingUpdates).map(x => {
				return {
					field_id: x,
					value: this.state.pendingUpdates[x]
				};
			});
			if (fields.length == 0) return;
			return axios.post(`/api/projects/${this.state.activeProject.id}`, {
				fields
			})
				.then(() => {
					commit('RESET_UPDATES');
					return 1;
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
		},
		activeLayout: state => {
			if (state.projectLayouts[state.activeProjectType]) {
				return state.projectLayouts[state.activeProjectType];
			}
			return {};
		},
		getFieldVal: (state) => (id) => {
			let f = state.activeProject.fields.find(x => x.field_id == id);
			return f ? f.value : '';
		}
	},
	modules: {
	}
})