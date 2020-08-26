<template src="./Zone.html"></template>
<script>
export default {
    props: ["item"]
}
</script>
<style lang="scss">
    .zone {
        &.editing {
            .zone-container {
                min-height: 200px;
                padding: 15px;
                background: lightblue;
                border: 1px solid black;
            }
            .zone-new {
                display: inline-block;
                margin-top: 15px;
                border: 1px solid black;
                background: teal;
                padding: 10px;
                color: white;
                &:hover {
                    opacity: 0.7;
                    cursor: pointer;
                }
            }
        }
    }
</style>