<template src="./ToolNav.html">
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
        projectTypeDisplayName: function() {
            return this.$store.getters.activeProjectType ? this.$store.getters.activeProjectType.name : ''
        },
        layoutUrl: function() {
            return this.$store.getters.activeProjectType ? `/dash/${this.$store.getters.activeProjectType.codename}/layout` : ''
        },
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
    .utility-nav {
        width: 100%;
    }
</style>