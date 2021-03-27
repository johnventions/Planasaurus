<template src="./SideNav.html">
</template>
<script>
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'SideNav',
    data: function() {
        return {
            drawer: null
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
            viewMode: state => state.viewMode,
            navItems: state => state.projectTypes.filter( x => x.parent_id == null),
        }),
    },
    mounted: function() {
    },
    methods: {
        parseUrl(item) {
            return `/dash/${item.codename}`;
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