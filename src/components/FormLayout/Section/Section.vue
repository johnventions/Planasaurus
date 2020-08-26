<template src="./Section.html"></template>
<script>
import Zone from "../Zone/Zone";

export default {
    name: 'Section',
    props: ['item'],
    components: {
        'layout-zone': Zone
    },
    methods: {
        getClass(i) {
            if (this.item.style == "50-50") {
                return "col-6";
            } else if (this.item.style == "33-66") {
                return  i == 0 ? "col-4" : "col-8";
            } else if (this.item.style == "66-33") {
                return  i == 0 ? "col-8" : "col-4";
            }
            return "col-12";

        }
    }
}
</script>
<style lang="scss">
    .section {
        padding: 10px 0;
        position: relative;
    }
</style>