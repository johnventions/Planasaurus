import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

import api from '@/util/api';

import viewModes from "../data/viewModes";
import Layout from "@/models/class.layout";
import Project from '@/models/class.project';



const refreshWindow = 90000;

const refreshValidator = function(fetch, loading, lastUpdate, window) {
	if (fetch) return true; // return if already loading
	if (loading) return true;
	if (Date.now() - lastUpdate < (window || refreshWindow)) return true;
	return false;
}

const processRecordChildren = function(childRecords) {
	return childRecords.map(x => Project.FromData(x) );
}

export default new Vuex.Store({
	state: {
		authLogin: null, // promise for login lookup
		authenticated: false,
		user: null,
		activeWorkspace: null,

		activeTypeCodename: '',
		activeProjectType: {},

		activeProject: null,
		pendingUpdates: {},
		pendingFind: {},

		// objects to track various project data
		projectTypes: [],
		projectTypesMap: {
			name: {},
			id: {}
		},
		projectFields: {},
		projectLists: {},
		projectLayouts: {},

		viewMode: viewModes.VIEW,
		templateEditor: {
			layout: null,
			field: null,
		}
	},
	mutations: {
		START_LOGIN: function(state, prom) {
			state.authLogin = prom;
		},

		SET_LOGIN: function(state, user) {
			state.authLogin = null;
			state.authenticated = true;
			state.user = user;
		},

		SET_WORKSPACE: function(state, workspace) {
			state.activeWorkspace = workspace;
		},

		/* TYPES */
		SET_TYPES: function (state, types) {
			// set TYPES to be key'ed off of type ID
			const mappedIDs = types.reduce((obj, x) => {
				obj[x.id] = x;
				return obj;
			}, {});

			// set TYPES to be key'ed off of type URL
			const mappedNames = types.reduce((obj, x) => {
				obj[x.codename] = x;
				return obj;
			}, {});
			state.projectTypesMap = {
				name: mappedNames,
				id: mappedIDs,
			};
			state.projectTypes = types;
			if (state.activeProjectType.id == null && state.activeTypeCodename != '') {
				state.activeProjectType = state.projectTypesMap.name[state.activeTypeCodename];
			}
		},
		
		UPDATE_ACTIVE_TYPE: function(state, typeName) {
			const activeType = state.projectTypesMap.name[typeName];
			state.activeTypeCodename = typeName;
			state.activeProjectType = activeType || {};
		},

		/* PROJECTS */
		LOADING_LIST: function (state, pkg) {
			// { id, fetch }
			const { id , fetch } = pkg;
			let currentList = state.projectLists[id] || {};
			let newList = {
				...currentList,
				loading: true,
				fetch: fetch
			};
			Vue.set(state.projectLists, id, newList);
		},

		SET_LIST: function (state, pkg) {
			const { id, list, total } = pkg;
			Vue.set(state.projectLists, id, {
				loading: false,
				fetch: null,
				lastUpdate: Date.now(),
				list: list,
				total: total
			});
			state.viewMode = viewModes.VIEW;
		},


		/* FIELDS */
		LOADING_FIELDS: function (state, pkg) {
			const { id, fetch } = pkg;
			let currentFields = state.projectFields[id] || {};
			let newList = {
				...currentFields,
				loading: true,
				fetch
			};
			Vue.set(state.projectFields, id, newList);
		},

		SET_FIELDS: function (state, pkg) {
			const { id, fields } = pkg;
			Vue.set(state.projectFields, id, {
				loading: false,
				lastUpdate: Date.now(),
				fields: fields,
				fetch: null
			});
		},

		EDIT_LAYOUT_FIELD: function (state, field) {
			state.templateEditor.field = field;
		},

		PUSH_FIELD: function(state, pkg) {
			const { id, field } = pkg;
			if (state.projectFields[id]) {
				let currentFields = state.projectFields[id];
				currentFields.fields.push(field);
				Vue.set(state.projectFields, id, currentFields);
			}
		},

		/* LAYOUTS */
		LOADING_LAYOUT: function (state, pkg) {
			const { id, fetch } = pkg;
			let currentLayout = state.projectLayouts[id] || {};
			let newLayout = {
				...currentLayout,
				loading: true,
				fetch
			};
			Vue.set(state.projectLayouts, id, newLayout);
		},
		
		SET_LAYOUT: function (state, pkg) {
			const { id, layout, related } = pkg;
			Vue.set(state.projectLayouts, id, {
				fetch: null,
				loading: false,
				lastUpdate: Date.now(),
				layout: new Layout(layout),
				related: related
			});
		},

		MODIFY_LAYOUT_AREA: function (state, pkg) {
			const { type, area, areaName } = pkg; 
			let currentLayout = state.projectLayouts[type.id].layout;
			Vue.set(currentLayout, areaName, area);
		},

		SET_RECORD: function(state, project) {
			if (state.viewMode != viewModes.VIEW) {
				state.viewMode = viewModes.VIEW;
			}
			if (state.activeProject && state.activeProject.id != project.id) {
				//state.projectFields = {};
			}
			state.activeProject = Project.FromData(project);
			//router.push(`/dash/${project.codename}/${project.id}`);
		},

		UPDATE_FIELD(state, pkg) {
			if (state.viewMode == viewModes.FIND) {
				Vue.set(state.pendingFind, pkg.id, pkg.value);
			} else {
				Vue.set(state.pendingUpdates, pkg.id, pkg.value);
			}
		},

		RESET_UPDATES(state) {
			state.pendingUpdates = {};
		},

		// VIEWS
		START_FIND_MODE(state) {
			if (state.viewMode != viewModes.FIND) {
				state.pendingFind = {};
				state.viewMode = viewModes.FIND;
			}
		},

		START_VIEW_MODE(state) {
			if (state.viewMode != viewModes.VIEW) {
				state.pendingFind = {};
				state.viewMode = viewModes.VIEW;
			}
		}
	},
	actions: {
		getLoginStatus({ commit, dispatch }) {
			// if logged in, return user
			if (this.state.authenticated) return this.state.user;
			// if already looking up user, return promise
			if (this.state.authLogin) return this.state.authLogin;
			// otheriwse, lets check login status
			const lookup = axios.get('/signin/status')
				.then(res => {
					if (res.data && res.data.user) {
						commit('SET_LOGIN', res.data.profile);
						commit('SET_WORKSPACE', res.data.workspace);
						dispatch('getTypes');
					}
					return res.data.user;
				});
			commit('START_LOGIN', lookup);
			return lookup;
		},

		getTypes({ commit }) {
			axios.get("/api/types")
				.then(result => {
					commit('SET_TYPES', result.data.types);
				});
		},

		getProjectListById({ commit }, id) {
			// pull in latest list
			if (id == null) return;
			const searchParams = {
				type: id
			};
			const fetch = api.getProjects(searchParams)
				.then(result => {
					commit('SET_LIST', {
						id: id,
						list: result.data.list,
						total: result.data.total,
					});
				});
			commit('LOADING_LIST', {
				id,
				fetch
			});
		},

		getProjectFieldsByType({ commit }, type) {
			const { id } = type;
			if (this.state.projectFields[id]) {
				const { fetch, lastUpdate, loading } = this.state.projectFields[id];
				if (refreshValidator(fetch, loading, lastUpdate)) return; 
			}
			const fetchNew = axios.get(`/api/types/${id}/fields`)
				.then(result => {
					commit('SET_FIELDS', {
						id: id,
						fields: result.data.fields
					});
				});
			commit('LOADING_FIELDS', {
				id: type.id,
				fetchNew
			});
		},

		createField({ commit }, pkg) {
			const { id } = this.state.activeProjectType;

			return axios.post(`/api/types/${id}/fields`, pkg)
				.then(result => {
					let fieldPush = result.data.field;
					commit('PUSH_FIELD', { id, field: fieldPush}); // send field to the fieldList
					return fieldPush;
				});
		},

		getProjectLayoutByType({ commit }, type) {
			const { id } = type;
			if (this.state.projectLayouts[id]) {
				const { fetch, lastUpdate, loading } = this.state.projectLayouts[id];
				if (refreshValidator(fetch, loading, lastUpdate)) return;
			}
			const fetchNew = axios.get(`/api/types/${id}/layout`)
				.then(result => {
					commit('SET_LAYOUT', {
						id: id,
						layout: result.data.layout,
						related: result.data.related
					});
				});
			commit('LOADING_LAYOUT', {
				id: id,
				fetch: fetchNew 
			});
		},

		ensureProjectLayoutDisplay({ dispatch }, type) {
			// looks up the fields and the layout for a project type
			const searchType = this.state.projectTypesMap.name[type];
			if (searchType == null) return;
			const fieldLookup = dispatch('getProjectFieldsByType', searchType);
			const layoutLookup = dispatch('getProjectLayoutByType', searchType);
			return Promise.all([fieldLookup, layoutLookup]);
		},

		saveLatestLayout(_, pkg) {
			const { id } = this.state.activeProjectType;
			return axios.post(`/api/types/${id}/layout`, pkg)
				.then(result => {
					return result.data;
				})
		},

		getProjectRecord({ commit }, id) {
			return api.getProjectById(id)
				.then(response => {
					const children = processRecordChildren(response.data.children);
					commit('SET_RECORD', {
						...response.data.project,
						children
						}
					);
					return true;
				});
		},

		searchProjectRecords({ commit }) {
			const searchParams = {
				type: this.state.activeProjectType.id,
				...this.state.pendingFind
			};
			return api.getProjects(searchParams)
				.then(response => {
					console.log(response);
					const pkg = {
						id: this.state.activeProjectType.id,
						list: response.data.list,
						total: response.data.total,
					};
					commit('START_VIEW_MODE');
					commit('SET_LIST', pkg);
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

			const updatedProject = {
				...this.state.activeProject,
				fields
			};

			const { id } = this.state.activeProject;

			return axios.post(`/api/projects/${id}`, updatedProject)
				.then((response) => {
					commit('RESET_UPDATES');
					//commit('SET_RECORD', updatedProject);
					return response.data;
				})
		}
	},
	getters: {
		activeList: state => {
			const { id } = state.activeProjectType;
			if (id && state.projectLists[id]) {
				return state.projectLists[id];
			}
			return {};
		},
		prevItem: state => {
			if (state.activeProject && state.projectLists[state.activeProjectType.id]) {
				const list = state.projectLists[state.activeProjectType.id].list;
				const index = list.findIndex(x => x.id == state.activeProject.id);
				if (index == 0) return null;
				const prevItem = Math.max(index - 1, 0);
				return list[prevItem];
			}
			return null;
		},
		nextItem: state => {
			if (state.activeProject && state.projectLists[state.activeProjectType.id]) {
				const list = state.projectLists[state.activeProjectType.id].list;
				const index = list.findIndex(x => x.id == state.activeProject.id);
				if (index + 1 == list.length) return null;
				const nextItem = Math.min(index + 1, list.length - 1);
				return list[nextItem];
			}
			return null;
		},
		activeFields: state => {
			const { id } = state.activeProjectType;
			if (id && state.projectFields[id]) {
				return state.projectFields[id];
			}
			return {};
		},
		activeType: state => {
			const t = state.projectTypes.find(x => x.codename == state.activeProjectType);
			return t || {};
		},
		activeLayout: state => {
			const { id } = state.activeProjectType;
			if (id && state.projectLayouts[id]) {
				return state.projectLayouts[id];
			}
			return {};
		},
		getFieldVal: (state) => (id) => {
			let f = null;
			if (state.viewMode == viewModes.FIND) {
				f = state.pendingFind[id];
			} else {
				let field = state.activeProject.fields.find(x => x.field_id == id);
				f = field ? field.value : f;
			}
			return f;
		},
		getFieldArrayVal: (state) => (id) => {
			let f = [];
			if (state.viewMode == viewModes.FIND) {
				f = state.pendingFind[id] || [{}];
			} else if (state.activeProject.children) {
				let projectIDs = state.activeProject.fields.filter(x => x.field_id == id).map(y => parseInt(y.value));
				f = state.activeProject.children.filter(x => projectIDs.indexOf(x.id) > -1);
			}
			return f;
		},
		getFieldFiles: (state) => (id) => {
			let f = null;
			if (state.viewMode == viewModes.FIND) {
				f = state.pendingFind[id];
			} else {
				let files = state.activeProject.files.filter(x => x.field_id == id);
				f = files || [];
			}
			return f;
		},
		getFieldDefintion: (state) => (id) => {
			if (state.projectFields[state.activeProjectType.id]) {
				return state.projectFields[state.activeProjectType.id].fields.find(x => x.id == id);
			}
			return {};
		},
		getFieldsByTypeId: (state) => (id) => {
			const relatedTypeCode = state.projectTypes.find(x => x.id == id);
			if (relatedTypeCode != null) {
				const relatedFields = state.projectFields[relatedTypeCode.id];
				if (relatedFields && relatedFields.fields) {
					return relatedFields.fields;
				}
			}
			return [];
		}
	},
	modules: {
	}
})