<template src="./ProjectDetail.html"></template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import EditingArea from '@/components/ContentEditing/EditingArea/EditingArea'


export default {
    name: 'ProjectDetail',
    data: function() {
        return {
            activeType: null,
            activeID: null,
        }
    },
    watch: {
        projectTypes() {
            this.queryTypes();
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
            projectTypes: state => state.projectTypes,
            pendingUpdates: state => state.pendingUpdates
        }),
    },
    methods: {
        ...mapActions([
            'getProjectFields',
            'getProjectLayout',
            'getProjectRecord',
            'updateProject'
        ]),
        processPath: function() {
            this.activeType = this.$route.params.type;
            this.activeID = this.$route.params.id;
            if (this.activeType && this.activeID) {
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
        }

    },
    mounted: function() {
        this.queryTypes();
        this.processPath();
    }
    

}
</script>