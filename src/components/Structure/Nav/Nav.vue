<template src="./Nav.html">
</template>
<script>
import { mapState } from 'vuex';
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
		navItems: state => state.projectTypes.filter( x => x.parent_id == null)
    }),
    mounted: function() {
    },
    methods: {
        openNav() {
            this.navOpen = !this.navOpen;
        },
        parseUrl(item) {
            return `/dash/${item.codename}`;
        }
    }
}
</script>
<style>
    .bg-grey {
        background-color: #d6d6d6;
    }
</style>