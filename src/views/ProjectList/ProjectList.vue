<template src="./ProjectList.html"></template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import TableSort from '@/components/TableSort/TableSort';
import GoToProject from './cells/GoToProject'

export default {
    name: 'ProjectList',
    data: function() {
        return {
            fieldToAdd: '',
        }
    },
    components: {
        TableSort
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
        activeFieldsforDropdown: function() {
            const f = this.$store.getters.activeFields;
            if (f && f.fields) {
                return f.fields.filter(x => x.parent == null);
            } 
            return [];
        },
        layoutUrl: function() { return  `/dash/${this.activeProjectType}/layout`; },
        columns: function() {
            const fieldLayout = this.$store.getters.activeProjectType.fieldLayout || [];
            const fieldColumns = fieldLayout.map( x => {
                const f = this.$store.getters.getFieldDefintion(x.id);
                return  {
                    name: x.id,
                    label: f.name
                }
            });
            return [
                {
                    name: 'ID',
                    label: 'ID',
                },
                ... fieldColumns,
                {
                    name: 'GoTo',
                    label: '',
                    component: GoToProject
                }
            ]
        },
        rows: function() {
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
        }
    },
    methods: {
        ...mapMutations({
            'startViewMode': 'START_VIEW_MODE'
        }),
        ...mapActions([
            'getProjectListById',
            'modifyListLayout'
        ]),
        processPath: function() {
            if (this.activeProjectType != null && this.$route.query.search == null) {
                this.queryList();
            }
        },
        queryList() {
            this.getProjectListById(this.activeProjectType.id);
        },
        parseUrl(project) {
            return `${this.activeProjectType.codename}/${project.id}`;
        },
        addField: function() {
            this.$modal.show("fieldConfigure");
        },
        addFieldToLayout: function() {
            this.$modal.hide("fieldConfigure");
            const modified = {
                type: this.activeProjectType.id,
                layout: [
                    ... this.activeProjectType.fieldLayout,
                    {
                        id: this.fieldToAdd
                    }
                ]
            };
            this.modifyListLayout(modified)
        }
    },
    mounted: function() {
        this.processPath();
    }
    
}
</script>
<style lang="scss">
    .list-container {
        height: 100vh;
    }
</style>