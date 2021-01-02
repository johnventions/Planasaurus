<template>
    <div class='child-entry'>
        <div v-for="(field, i) in fieldList"
            class="child-col"
            :key="i">
            {{ field.value }}
        </div>
    </div>
</template>
<script>
export default {
    props: ['entry', 'fieldmeta'],
    data: function() {
        return {
            metaValues: []
        };
    },
    computed: {
        fieldList: function() {
            const list = this.fieldmeta.fieldDisplay || [];

            // map display fields with their values
            return list.map( x => {
                return {
                    id: x.id,
                    ... this.metaValues[x.id] || {}
                }
            });
        }
    },
    mounted: function() {
        this.metaValues = this.entry.child_meta;
    }
}
</script>
<style lang="scss" scoped>
    .child-entry {
        display: table-row;
        .child-col {
            padding: 2px 10px;
            display: table-cell;
            flex-grow: 1;
            border: 1px solid grey;
        }
    }
</style>