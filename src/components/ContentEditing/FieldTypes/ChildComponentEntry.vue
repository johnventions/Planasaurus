<template>
    <div class='child-entry'>
        <div v-for="(field, i) in fieldList"
            class="child-col"
            :key="i">
            {{ field.value }}
        </div>
        <div class="child-col settings">
            <dropdown-menu
                v-model="show">
            <button class="btn btn-primary dropdown-toggle">
                <font-awesome-icon icon="cog" size="1x" />
            </button>
            <div slot="dropdown">
                <button class="dropdown-item" @click="removeElement">
                    Remove
                </button>
            </div>
        </dropdown-menu>
            
        </div>
    </div>
</template>
<script>
export default {
    props: ['entry', 'fieldmeta'],
    data: function() {
        return {
            show: false,
            fieldsDictionary: this.entry.fieldsMapped || {}
        };
    },
    computed: {
        fieldList: function() {
            const list = this.fieldmeta.fieldDisplay || [];
            // map display fields with their values
            return list.map( x => {
                const existing = this.fieldsDictionary[x.id] || {};
                return {
                    id: x.id,
                    ... existing
                }
            });
        },
    },

    methods: {
        removeElement: function() {
            this.$emit('remove-me');
        }
    },

    mounted: function() {
        this.fieldsDictionary = this.entry.fieldsMapped;
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

            &.settings {
                width: 30px;
                padding: 0 8px;
            }
        }
    }
</style>