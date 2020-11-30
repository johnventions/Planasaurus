<template src="./ProjectList.html"></template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
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
    computed: {
        ...mapState({
            projectTypes: state => state.projectTypes,
        }),
        ...mapGetters([
            'activeList'
        ]),
        layoutUrl: function() { return  `/dash/${this.activeType}/layout`; }
    },
    methods: {
        ...mapActions([
            'getProjectList'
        ]),
        processPath: function() {
            this.activeType = this.$route.params.type;
            console.log(this.$route);
            if (this.activeType != null && this.$route.query.search == null) {
                this.queryList();
            }
        },
        queryList() {
            this.getProjectList(this.activeType);
        },
        parseUrl(project) {
            return `${this.activeType}/${project.id}`;
        },
    },
    mounted: function() {
        this.processPath();
    }
    
}
</script>