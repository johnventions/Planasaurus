<template src="./ProjectDetail.html"></template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import EditingArea from '@/components/ContentEditing/EditingArea/EditingArea'
import Project from '@/models/class.project'

export default {
    name: 'ProjectDetail',
    data: function() {
        return {
            activeID: null,
        }
    },
    watch: {
        projectTypes() {
            this.queryTypes();
        },
        $route() {
            this.processPath();
        // react to route changes...
        },
        activeType() {
            this.processPath();
        }
    },
    components: {
        'editing-area': EditingArea
    },
    computed: {
        ...mapGetters([
            'activeType',
            'activeFields',
            'activeLayout'
        ]),
        ...mapState({
            activeProject: state => state.activeProject,
            projectTypes: state => state.projectTypes,
            pendingUpdates: state => state.pendingUpdates,
            pendingFind: state => state.pendingFind,
            viewMode: state => state.viewMode,
        }),
    },
    methods: {
        ...mapActions([
            'getProjectFields',
            'getProjectLayout',
            'getProjectRecord',
            'updateProject'
        ]),
        ...mapMutations({
           setRecord: 'SET_RECORD'
        }),
        processPath: function() {
            this.activeID = this.$route.params.id;
            if (this.activeID == "new" && this.activeType) {
                this.setRecord(new Project(this.activeType.id));
            } else if (this.activeType && this.activeID) {
                this.queryList();
            }
        },
        queryList: function() {
            this.getProjectLayout(this.activeType);
            this.getProjectRecord(this.activeID).then(() => {
                if (this.activeFields.fields == null) {
                    this.getProjectFields(this.activeType);
                }
            });
        },
        queryTypes: function() {
            // get the types
            if (this.activeType) {
                this.getProjectFields(this.activeType);
                this.getProjectLayout(this.activeType);
            }
        },
        saveChanges: function() {
            this.updateProject();
        },
        initiateFind: function() {
            
        }

    },
    mounted: function() {
        this.queryTypes();
        this.processPath();
    }
    

}
</script>