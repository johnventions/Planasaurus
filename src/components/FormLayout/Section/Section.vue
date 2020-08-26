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
                if (i == 0) {
                    return "col-4";
                }
                return "col-8";
            } else if (this.item.style == "66-33") {
                if (i == 0) {
                    return "col-8";
                }
                return "col-4";
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

    .section-new {
        border-radius: 50%;
        border: 1px solid black;
        width: 30px;
        height: 30px;
        position: absolute;
        left: -15px;
        bottom: -16px;
        z-index: 20;
        text-align: center;
        background: coral;
        font-weight: bold;
        cursor: pointer;
        &:hover {
            background: lightcoral;
        }
    }
</style>