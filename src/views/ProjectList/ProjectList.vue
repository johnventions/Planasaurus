<template src="./ProjectList.html"></template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import convertListToTable from '@/util/convertListToTable'
import GoToProject from '@/components/ListDisplay/GoToProject'
import determineDisplayComponent from '@/data/determineDisplayComponent'

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
            'activeProjectType',
            'getRelatedFieldVal'
        ]),
        headers: function() {
            const fieldLayout = this.$store.getters.activeProjectType.fieldLayout || [];
            const fieldColumns = fieldLayout.map( x => {
                const f = this.$store.getters.getFieldDefintion(x.id) || {};
                const displayComponent = determineDisplayComponent(f);
                const foreignKeyType = f.relationship_type;
                return  {
                    customField: true,
                    text: f ? f.name : x.id,
                    value: x.id.toString(),
                    data_type: f.data_type,
                    displayComponent,
                    foreignKeyType,
                    relatedKey: f.related_keys
                }
            });
            const base_headers = [{
                    text: '',
                    value: 'APP_VIEW',
                    sortable: false,
                    displayComponent: GoToProject
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
            ]
        },
        dynamicColumns: function() {
            return this.headers.filter(y => y.displayComponent != null);
        },
        items: function() {
            const { list }  = this.$store.getters.activeList;
            const fieldHeaders = this.headers || [];
            return convertListToTable(list, fieldHeaders, this.activeProjectType);
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
    .project-list-table {
        table {
            tr td {
                padding-bottom: 10px;
            }

            colgroup col:first-of-type {
                width: 50px;
            }
        }
    }
    
</style>