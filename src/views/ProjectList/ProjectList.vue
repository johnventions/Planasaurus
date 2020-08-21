<template src="./ProjectList.html"></template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'ProjectList',
    data: function() {
        return {
            activeType: null,
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
    computed: mapState({
        projectTypes: state => state.projectTypes,
        activeList: state => state.activeList,
    }),
    methods: {
        ...mapActions([
            'getProjectList'
        ]),
        processPath: function() {
            this.activeType = this.$route.params.type;
            if (this.activeType != null) {
                this.queryList();
            }
        },
        queryList() {
            this.getProjectList(this.activeType);
        },
        parseUrl(project) {
            return `${this.activeType}/${project.id}`;
        }
    },
    mounted: function() {
        this.processPath();
    }
    
}
</script>