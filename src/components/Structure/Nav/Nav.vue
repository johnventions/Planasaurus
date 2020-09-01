<template src="./Nav.html">
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'Nav',
    components: {

    },
    computed: mapState({
		navItems: state => state.projectTypes.filter( x => x.parent_id == null)
    }),
    mounted: function() {
    },
    methods: {
        parseUrl(item) {
            return `/dash/${item.codename}`;
        }
    }
}
</script>