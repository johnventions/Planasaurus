<template src="./ProjectDetail.html"></template>
<script>
import Layout from '@/components/Layout/Templating/Layout/Layout';

export default {
    name: 'ProjectDetail',
    data: function() {
        return {
            activeType: null,
            activeID: null,
            activeProject: null,
        }
    },
    components: {
        'layout': Layout
    },
    methods: {
        processPath: function() {
            this.activeType = this.$route.params.type;
            this.activeID = this.$route.params.id;
            if (this.activeType && this.activeID) {
                this.queryList();
            }
        },
        queryList: function() {
            this.$http.get(`/api/projects/${this.activeID}`)
                .then( response => {
                    console.log(response);
                    this.activeProject = response.data.project[0];
                })
        }
    },
    mounted: function() {
        this.processPath();
    }
    

}
</script>