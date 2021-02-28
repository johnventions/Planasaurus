<template src="./SideNav.html">
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
export default {
    name: 'SideNav',
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
            'activeLayout',
            'activeList',
            'prevItem',
            'nextItem',
            'activeProjectType'
        ]),
        ... mapState({
            authenticated: state => state.authenticated,
            viewMode: state => state.viewMode,
            navItems: state => state.projectTypes.filter( x => x.parent_id == null),
        }),
        layoutEditing: function() {
            if (this.$route.name == "Project Layout") {
                return true;
            }
            return false;
        },
        currentItemDisplay: function() {
            const list = this.$store.getters.activeList.list;
            const total = this.$store.getters.activeList.total;
            if (this.$route.name == "Project Detail") {
                if (this.$store.state.activeProject == null) return 0
                const id = this.$store.state.activeProject.id;
                const index = list.findIndex(x => x.id == id) + 1;
                return `${index} of ${list.length}`
            }
            if (total == list.length) return `${list.length} items`;
            return `${list.length} items <br/> ${total} total`;
        }
    },
    mounted: function() {
    },
    methods: {
        ...mapMutations({
            startFindMode: 'START_FIND_MODE',
            startViewMode: 'START_VIEW_MODE',
            setRecord: 'SET_RECORD',
        }),
        ...mapActions([
            'searchProjectRecords',
            'saveLatestLayout'
        ]),
        handleScroll(){
                const scrollPosition = window.scrollY;
                if(scrollPosition>=200){
                    this.isSticky = true
                }else if (scrollPosition < 100) {
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
            this.$router.go(-1);
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
        },
        goPrev() {
            if (this.prevItem) {
                const id = this.prevItem.id;
                this.setRecord(this.prevItem);
                this.$router.push(`/dash/${this.activeProjectType.codename}/${id}`)
            }
        },
        goNext() {
            if (this.nextItem) {
                const id = this.nextItem.id;
                this.setRecord(this.nextItem);
                this.$router.push(`/dash/${this.activeProjectType.codename}/${id}`)
            }
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
<style lang="scss">
    .sidenav {
        height: 100%;
        min-height: 100vh;
        color: white;
        font-size: 16px;

        a {
            color: white;
            font-size: 16px;
        }

        a.nav-link {
            transition: margin 0.5s ease;
            &:hover {
                text-decoration: underline;
                margin-left: 5px;
            }
        }
    }

    .nav-menu {
        ul { 
            padding: 0;
        }
    }
    nav.utility-nav.sticky {
        position: fixed;
        width: 100%;
        z-index: 40;
    }
    .bg-grey {
        background-color: #d6d6d6;
    }
    .navbar-nav {
        width: 100%;
        flex-direction: column;
        @media screen and (min-width: 768px) {
            flex-direction: initial;
        }
    }
    .nav-item {
        display: block;
        .nav-link {
            padding: 0;
        }
    }
    button.nav-link {
        background: none;
        border: none;
    }
    .util {
        margin-left: auto;
    }
    .utility-nav {
        .navbar-nav {
            flex-direction: inherit;
        }
        .nav-item {
            min-width: 85px;
            padding: 0 8px;
            text-align: center;
            max-width: 33%;
        }
    }
    .nav-item .nav-link > svg {
        width: 30px;
        display: block;
        margin: 0 auto;

        &.inline {
            display: inline-block;
        }
    }
</style>