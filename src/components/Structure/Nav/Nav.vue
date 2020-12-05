<template src="./Nav.html">
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
export default {
    name: 'Nav',
    data: function() {
        return {
            isSticky: false,
            navOpen: false,
        }
    },
    components: {

    },
    computed: {
        ... mapGetters([
            'activeType',
            'activeLayout'
        ]),
        ... mapState({
            viewMode: state => state.viewMode,
            navItems: state => state.projectTypes.filter( x => x.parent_id == null),
            activeProjectType: state => state.activeProjectType,
            projectTypeDisplayName: state => state.activeProjectType ? state.activeProjectType.name : '',
            layoutUrl: function(state) { return  `/dash/${state.activeProjectType}/layout`; }
        }),
        layoutEditing: function() {
            if (this.$route.name == "Project Layout") {
                return true;
            }
            return false;
        }
    },
    mounted: function() {
    },
    methods: {
        ...mapMutations({
            startFindMode: 'START_FIND_MODE',
            startViewMode: 'START_VIEW_MODE'
        }),
        ...mapActions([
            'searchProjectRecords',
            'saveLatestLayout'
        ]),
        handleScroll(){
                const scrollPosition = window.scrollY;
                if(scrollPosition>=100){
                    this.isSticky = true
                }else{
                    this.isSticky = false
                }
        },
        openNav() {
            this.navOpen = !this.navOpen;
        },
        parseUrl(item) {
            return `/dash/${item.codename}`;
        },
        cancelClick() {
            this.startViewMode();
        },
        findClick() {
          this.startFindMode();
        },
        saveLayout() {
            let pkg = {
                layout: this.activeLayout.layout
            };
            this.saveLatestLayout(pkg);
        }
    },
    created () {
            window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
            window.removeEventListener('scroll', this.handleScroll);
    },
}
</script>
<style lang="scss">
    nav.utility-nav.sticky {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 40;
    }
    .bg-grey {
        background-color: #d6d6d6;
    }
    .navbar-nav {
        width: 100%;
        flex-direction: initial;
    }
    .nav-item {
        display: inline-block;
        padding: 0 12px;
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
            min-width: 85px;
            padding: 0 8px;
            text-align: center;
        }
    }
    .nav-item .nav-link > svg {
        width: 30px;
        display: block;
        margin: 0 auto;
    }
</style>