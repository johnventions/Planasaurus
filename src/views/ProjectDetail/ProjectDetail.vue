<template src="./ProjectDetail.html"></template>
<script>
import { mapActions, mapGetters } from 'vuex';
import EditingArea from '@/components/ContentEditing/EditingArea/EditingArea'


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
        'editing-area': EditingArea
    },
    computed: {
        ...mapGetters([
            'activeFields',
            'activeLayout'
        ]),
    },
    methods: {
        ...mapActions([
            'getProjectFields',
            'getProjectLayout',
        ]),
        processPath: function() {
            this.activeType = this.$route.params.type;
            this.activeID = this.$route.params.id;
            if (this.activeType && this.activeID) {
                this.queryList();
            }
        },
        queryList: function() {
            this.getProjectLayout();
            this.$http.get(`/api/projects/${this.activeID}`)
                .then( response => {
                    console.log(response);
                    this.activeProject = response.data.project;
                })
        }
    },
    mounted: function() {
        this.processPath();
    }
    

}
</script>