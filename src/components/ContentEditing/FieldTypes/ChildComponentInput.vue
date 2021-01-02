<template>
    <div class="form-group" 
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <label>{{ field.name }}</label><br/>
        <div class="nested-input" v-if="value.length">
            <child-entry v-for="(child, i) in value"
                :entry="child"
                :fieldmeta="field.metadata"
                :key="i">
            </child-entry>
        </div>
        <div v-else>
            No records
        </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import ChildComponentEntry from './ChildComponentEntry';

export default {
    name: 'ChildElementComponent',
    props: [
        'field', 'type'
    ],
    components: {
        'child-entry': ChildComponentEntry
    },
    data: function() {
        return {
            value: this.$store.getters.getFieldArrayVal(this.field.id),
            touched: false,
        }
    },
    watch: {
        viewMode: function() {
            this.resetValue();
        }
    },
    computed: {
        ... mapState({
            viewMode: state => state.viewMode,
        }),
        childFields: function() {
            return this.value;
        },
    },
    methods: {
        ...mapMutations({
           updateField: 'UPDATE_FIELD'
        }),
        handleUpdate(){
            this.updateField({
                id: this.field.id,
                value: this.value
            });
            this.touched = true;
        },
        resetValue() {
            this.value = this.$store.getters.getFieldArrayVal(this.field.id);
            this.touched = false;
        }
    },
    mounted: function() {
        this.$store.subscribe((mutation) => {
            if (mutation.type == "SET_RECORD") {
                this.resetValue();
            } else if (mutation.type == "RESET_UPDATES") {
                this.touched = false;
            }
        });
    }
}
</script>
<style lang="scss" scoped>
    .nested-input {
        border: 1px solid black;
        display: table;
        width: 100%;
    }
    .form-group {
        &.find {
            .input-container {
                position: relative;
                &:after {
                    display: block;
                    position: absolute;
                    content: 'X';
                    height: 20px;
                    width: 20px;
                    right: 5px;
                    top: 5px;
                }
            }
            select {
                    background-color: #d9f6ff;
                }
        }

        select {
            &.touched {
                border: 2px solid #328d32;
                font-weight: bold;
            }
        }
    }
</style>