<template src="./Section.html"></template>
<script>
import Zone from "../Zone/Zone";

export default {
    name: 'Section',
    props: ['item', 'index'],
    components: {
        'layout-zone': Zone
    },
    methods: {
        getClass(i) {
            if (this.item.style == "50-50") {
                return "col-sm-6";
            } else if (this.item.style == "33-33-33") {
                return "col-sm-4";
            } else if (this.item.style == "33-66") {
                return  i == 0 ? "col-sm-4" : "col-sm-8";
            } else if (this.item.style == "66-33") {
                return  i == 0 ? "col-sm-8" : "col-sm-4";
            }
            return "col-12";
        },
        handleUpdateChild(index, item) {
            let newItem = { ... this.item };
            // update the zone that was modified
            newItem.zones[index] = item;
            // pass new definition up to parent LAYOUT
            this.$emit('updatechild', this.index, newItem);
        }
    }
}
</script>
<style lang="scss">
</style>