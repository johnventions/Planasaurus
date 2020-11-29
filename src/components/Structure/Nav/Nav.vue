<template src="./Nav.html">
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'Nav',
    data: function() {
        return {
            navOpen: false,
        }
    },
    components: {

    },
    computed: mapState({
        viewMode: state => state.viewMode,
        navItems: state => state.projectTypes.filter( x => x.parent_id == null),
        activeProjectType: state => state.activeProjectType,
        layoutUrl: function(state) { return  `/dash/${state.activeProjectType}/layout`; }
    }),
    mounted: function() {
    },
    methods: {
        ...mapMutations({
            startFindMode: 'START_FIND_MODE'
        }),
        openNav() {
            this.navOpen = !this.navOpen;
        },
        parseUrl(item) {
            return `/dash/${item.codename}`;
        },
        findClick() {
          this.startFindMode();
        }
    }
}
</script>
<style lang="scss">
    .bg-grey {
        background-color: #d6d6d6;
    }
    .navbar-nav {
        width: 100%;
    }
    button.nav-link {
        background: none;
        border: none;
    }
    .util {
        margin-left: auto;
    }
    .utility-nav {
        .nav-item {
            min-width: 80px;
            text-align: center;
        }
    }
    .nav-item .nav-link > svg {
        width: 30px;
        display: block;
        margin: 0 auto;
    }
</style>