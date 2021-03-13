<template src="./ProjectList.html"></template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import GoToProject from './cells/GoToProject'

export default {
    name: 'ProjectList',
    data: function() {
        return {
            show: false,
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
            return [
                {
                    text: 'ID',
                    value: 'ID',
                },
                ... fieldColumns,
                {
                    text: '',
                    value: 'GoTo',
                    sortable: false,
                }
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
                        ID: row.id,
                        ... fieldRows,
                        GoTo: {
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
                return this.$store.getters.getFieldDefintion(x.id) || {id: x.id};
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
            'modifyListLayout'
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
            this.$modal.show("fieldConfigureModal");
        },
        addField: function() {
            this.$modal.show("fieldAddModal");
        },
        addFieldToLayout: function() {
            this.$modal.hide("fieldAddModal");
            const modified = {
                type: this.activeProjectType.id,
                layout: [
                    ... this.activeProjectType.fieldLayout,
                    {
                        id: this.fieldToAdd
                    }
                ]
            };
            this.modifyListLayout(modified);
        },
        removeFieldFromLayout: function() {
            this.$modal.hide("fieldConfigureModal");
            const layout = [... this.activeProjectType.fieldLayout]
            layout.splice(this.fieldToEdit, 1);
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
    }
</style>