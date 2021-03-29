<template src="./ProjectList.html"></template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import GoToProject from './cells/GoToProject'

export default {
    name: 'ProjectList',
    data: function() {
        return {
            show: false,
            fieldAddModal: false,
            fieldConfigureModal: false,
            fieldToAdd: '',
            fieldToEdit: ''
        }
    },
    components: {
        'goto': GoToProject
    },
    watch: {
        $route(to, from) {
            if (to.params.type !== from.params.type) {
                this.processPath();
            }
        },
        projectTypes() {
            this.processPath();
        }
    },
    computed: {
        ...mapState({
            projectTypes: state => state.projectTypes,
        }),
        ...mapGetters([
            'activeList',
            'activeProjectType'
        ]),
        headers: function() {
            const fieldLayout = this.$store.getters.activeProjectType.fieldLayout || [];
            const fieldColumns = fieldLayout.map( x => {
                const f = this.$store.getters.getFieldDefintion(x.id) || {};
                return  {
                    text: f ? f.name : x.id,
                    value: x.id.toString(),
                }
            });
            const base_headers = [{
                    text: '',
                    value: 'APP_VIEW',
                    sortable: false,
            }];
            if (fieldColumns.length == 0) {
                base_headers.push({
                    text: 'ID',
                    value: 'ID',
                });
            }
            return [
                ...base_headers,
                ... fieldColumns,
                // {
                //     text: '',
                //     value: 'APP_GOTO',
                //     sortable: false,
                // }
            ]
        },
        items: function() {
            const typeList = this.$store.getters.activeList;
            const fieldLayout = this.$store.getters.activeProjectType.fieldLayout || [];
            if (typeList.list) {
                const formatted = typeList.list.map( row => {
                    let fieldRows = {};
                    fieldLayout.forEach( y => {
                        fieldRows[y.id] = row.getFieldValue(y.id)
                    });
                    return {
                        APP_VIEW: {
                            id: row.id
                        },
                        ID: row.id,
                        ... fieldRows,
                        APP_GOTO: {
                            id: row.id
                        }
                    }
                });
                return formatted;
            }
            return [];
        },
        activeFieldsforDropdown: function() {
            const f = this.$store.getters.activeFields;
            if (f && f.fields) {
                return f.fields.filter(x => x.parent == null);
            } 
            return [];
        },
        fieldLayoutDefinitions: function() {
            const layout = this.activeProjectType.fieldLayout;
            return layout.map(x => {
                const def = this.$store.getters.getFieldDefintion(x.id) || {id: x.id, name: x.id };

                return { ... def, uuid: x.uuid };
            });
        },
        layoutUrl: function() { return  `/dash/${this.activeProjectType}/layout`; },
    },
    methods: {
        ...mapMutations({
        }),
        ...mapActions([
            'getProjectListById',
            'getProjectFieldsByType',
            'modifyListLayout',
        ]),
        processPath: function() {
            if (this.activeProjectType != null && this.$route.query.search == null) {
                this.queryList();
            }
            this.getProjectFieldsByType(this.activeProjectType);
        },
        queryList() {
            this.getProjectListById(this.activeProjectType.id);
        },
        parseUrl(project) {
            return `${this.activeProjectType.codename}/${project.id}`;
        },
        editFields: function() {
            this.fieldToEdit = '';
            this.fieldConfigureModal = true;
        },
        addField: function() {
            this.fieldAddModal = true;
        },
        addFieldToLayout: function() {
            this.fieldAddModal = false;
            const modified = {
                type: this.activeProjectType.id,
                layout: [
                    ... this.activeProjectType.fieldLayout,
                    {
                        id: this.fieldToAdd,
                        uuid: uuidv4()
                    }
                ]
            };
            this.modifyListLayout(modified);
        },
        removeFieldFromLayout: function() {
            this.fieldConfigureModal = false;
            const layout = [... this.activeProjectType.fieldLayout];
            const index = this.fieldLayoutDefinitions.findIndex(x => x.uuid == this.fieldToEdit);
            layout.splice(index, 1);
            const modified = {
                type: this.activeProjectType.id,
                layout
            };
            this.modifyListLayout(modified);
        }
    },
    mounted: function() {
        this.processPath();
    }
    
}
</script>
<style lang="scss">
    table {
        tr td {
            padding-bottom: 10px;
        }

        colgroup col:first-of-type {
            width: 50px;
        }
    }
</style>