<template>
    <div class='child-entry'>
        <div v-for="(f, i) in fieldList"
            class="child-col"
            :key="i">
            <div 
                :field="f"
                :isNested="true"
                :parentField="field"
                :is="displayField">
            </div>
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
import BasicInput from '@/components/ContentEditing/FieldTypes/BasicInput.vue';

console.log(BasicInput);
export default {
    props: ['field', 'entry', 'fieldmeta'],
    components: {
       //BasicInput
    },
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
        displayField: function() {
            return BasicInput;
        }
    },

    methods: {
        removeElement: function() {
            this.$emit('remove-me');
        }
    },

    mounted: function() {
        this.fieldsDictionary = this.entry.fieldsMapped || {};
    }
}
</script>
<style lang="scss" scoped>
    .child-entry {
        display: table-row;
        .child-col {
            padding: 0px 0px;
            display: table-cell;
            flex-grow: 1;
            border: 1px solid grey;

            &.settings {
                width: 30px;
                padding: 0 8px;
            }

            .form-group {
                margin-bottom: 0;
            }
        }
    }
</style>