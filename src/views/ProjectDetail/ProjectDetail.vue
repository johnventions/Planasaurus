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
        activeProjectType() {
            this.processPath();
        }
    },
    components: {
        'editing-area': EditingArea
    },
    computed: {
        ...mapGetters([
            'activeFields',
            'activeLayout'
        ]),
        ...mapState({
            activeProject: state => state.activeProject,
            activeProjectType: state => state.activeProjectType,
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
            await this.ensureProjectLayoutDisplay(this.activeProjectType.codename);
            if (this.activeID == "new" && this.activeProjectType) {
                this.setRecord(
                    Project.New(this.activeProjectType.id)
                    );
            } else if (this.activeID == "find" && this.activeProjectType) {
                this.startFind();
            } else if (this.activeProjectType && this.activeID) {
                this.queryList();
            }
        },
        queryList: async function() {
            this.getProjectRecord(this.activeID).then(() => {
            });
        },
        queryTypes: function() {
            // get the types
            if (this.activeProjectType) {
                this.ensureProjectLayoutDisplay(this.activeProjectType.codename);
            }
        },

        saveChanges: async function() {
            const update = await this.updateProject();
            if (this.activeProject.id == 0) {
                this.$router.push(`/dash/${this.activeProjectType}/${update.id}`);
            }
        },

        saveHandler(e) {
            if (e.ctrlKey && e.keyCode === 83) {
                // CTRL+S Listener
                e.preventDefault();
                this.saveChanges();
            }
        }
    },

    mounted: function() {
        this.queryTypes();
        this.processPath();

        window.addEventListener("keydown", this.saveHandler);
    },
    
    beforeDestroy() {
        window.removeEventListener('keydown', this.saveHandler);
    },
    

}
</script>