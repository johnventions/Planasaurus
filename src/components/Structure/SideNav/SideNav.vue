<template src="./SideNav.html">
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name: 'SideNav',
    data: function() {
        return {
            drawer: null,
            sharingDialog: false,
            shareTo: null,
            workspaceSharedTo: []
        }
    },
    components: {
    },
    computed: {
        ... mapGetters([
            'activeList',
            'activeProjectType',
            'getWorkspace'
        ]),
        ... mapState({
            authenticated: state => state.authenticated,
            activeWorkspace: state => state.activeWorkspace,
            user: state => state.user,
            viewMode: state => state.viewMode,
            navItems: state => state.projectTypes.filter( x => x.parent_id == null),
        }),
    },
    mounted: function() {
    },
    methods: {
        ...mapActions([
            'setWorkspace'
        ]),
        parseUrl(item) {
            return `/dash/${item.codename}`;
        },
        changeWorkspace: async function(id) {
            await this.setWorkspace(id).then( () => {});
            this.$router.push('/dash/');
        },
        startShare() {
            this.shareTo = null;
            this.sharingDialog = true;
            this.getShared();
        },
        getShared() {
            this.$http.get(`/api/workspaces/${ this.activeWorkspace }/invite`)
                .then((response) => {
                    this.workspaceSharedTo = response.data;
                });
        },
        sendInvite() {
            if (!this.shareTo || this.shareTo == '') return;
            const pkg = {
                email: this.shareTo
            };
            this.$http.post(`/api/workspaces/${ this.activeWorkspace }/invite`, pkg)
                .then((response) => {
                    if (response.data.success) {
                        this.workspaceSharedTo = [ 
                            ...this.workspaceSharedTo,
                            {
                                email: this.shareTo,
                                accepted: 0
                            }
                        ];
                    }
                    this.shareTo = null;
                });
        }
    },
    created () {
            //window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
            //window.removeEventListener('scroll', this.handleScroll);
    },
}
</script>
<style lang="scss" scoped>
    .sidenav-header {
        min-height: 65px;
    }
</style>