<template src="./ProjectList.html"></template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
export default {
    name: 'ProjectList',
    data: function() {
        return {
        }
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
            activeProjectType: state => state.activeProjectType,
        }),
        ...mapGetters([
            'activeList',
            'activeType'
        ]),
        layoutUrl: function() { return  `/dash/${this.activeProjectType}/layout`; }
    },
    methods: {
        ...mapMutations({
            'startViewMode': 'START_VIEW_MODE'
        }),
        ...mapActions([
            'getProjectList'
        ]),
        processPath: function() {
            if (this.activeProjectType != null && this.$route.query.search == null) {
                this.queryList();
            }
        },
        queryList() {
            this.getProjectList(this.activeProjectType);
        },
        parseUrl(project) {
            return `${this.activeProjectType}/${project.id}`;
        },
    },
    mounted: function() {
        this.processPath();
    }
    
}
</script>