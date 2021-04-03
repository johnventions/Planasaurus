<template>
    <div class="form-group" 
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <v-autocomplete
            v-model="value"
            :items="options"
            item-text="value"
            item-value="key"
            :label="field.name"
            v-bind:class="{touched: touched}"
            v-on:change="handleUpdate"
            ></v-autocomplete>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
    props: [
        'field', 'type'
    ],
    data: function() {
        return {
            value: this.$store.getters.getFieldVal(this.field.id),
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
        options: function() {
            if (this.field.data_type == 6) {
                const relatedOptions = this.$store.getters.activeFields.related;
                if (relatedOptions && relatedOptions[this.field.id]) {
                    return relatedOptions[this.field.id].map( x => {
                        return {
                        key: x.project_id.toString(),
                        value: x.meta ? x.meta.map(x => x.value).join(" ") : x.project_id
                        }
                    });
                }
            }
            if (this.field.metadata == null || this.field.metadata.options == null) return [];
            return this.field.metadata.options.map( x => {
                return {
                key: x,
                value: x
                }
            });
        }
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
            this.value = this.$store.getters.getFieldVal(this.field.id);
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