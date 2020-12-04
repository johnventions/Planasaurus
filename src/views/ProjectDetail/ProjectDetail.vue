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
            'ensureProjectLayoutDisplay',
            'getProjectFields',
            'getProjectLayout',
            'getProjectRecord',
            'updateProject'
        ]),
        ...mapMutations({
           setRecord: 'SET_RECORD',
           startFind: 'START_FIND_MODE'
        }),
        processPath: async function() {
            this.activeID = this.$route.params.id;
            await this.ensureProjectLayoutDisplay(this.activeType.codename);
            if (this.activeID == "new" && this.activeType) {
                this.setRecord(
                    new Project(this.activeType.id)
                    );
            } else if (this.activeID == "find" && this.activeType) {
                this.startFind();
            } else if (this.activeType && this.activeID) {
                this.queryList();
            }
        },
        queryList: async function() {
            this.getProjectRecord(this.activeID).then(() => {
                console.log("Record retrieved");
            });
        },
        queryTypes: function() {
            // get the types
            if (this.activeType) {
                this.ensureProjectLayoutDisplay(this.activeType.codename);
            }
        },
        saveChanges: function() {
            this.updateProject();
        }

    },
    mounted: function() {
        this.queryTypes();
        this.processPath();
    }
    

}
</script>