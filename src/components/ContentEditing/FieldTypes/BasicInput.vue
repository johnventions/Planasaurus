<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <label v-if="!isNested && field.name">
            {{ field.name }}<br/>
        </label>
        <div class="input-container">
            <select v-model="searchOperator"
                v-if="viewMode == 'find' && useSearchOperators">
                <option :value="null">=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
            </select>
            <input :type="type" 
                class="form-control"
                v-bind:class="{touched: touched}"
                v-on:change="handleUpdate"
                v-on:keyup="handleUpdate"
                v-on:keyup.enter="handleSubmit"
                v-model="value"/>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
    name: 'BasicInput',
    props: [
        'field',
        'type',
        'isNested',
        'parentField'
    ],
    data: function() {
        return {
            value: this.isNested ? this.field.value : this.$store.getters.getFieldVal(this.field.id),
            touched: false,
            searchOperator: null,
        }
    },
    watch: {
        viewMode: function() {
            this.resetValue();
        },
        $route() {
            this.resetValue();
        },
    },
    computed: {
        ... mapState({
            viewMode: state => state.viewMode,
        }),
        useSearchOperators: function() {
            if (this.field.data_type == '3') {
                return true;
            }
            return false;
        },
        fieldIdForUpdate: function() {
            if (this.isNested) {
                return `${this.parentField.id}_${this.field.id}`;
            }
            return this.field.id;
        }
    },
    methods: {
        ...mapMutations({
           updateField: 'UPDATE_FIELD'
        }),
        ...mapActions([
            'searchProjectRecords',
            'saveLatestLayout'
        ]),
        handleUpdate: function(){
            const newVal = (this.viewMode == 'find' && this.searchOperator) ? `${this.searchOperator}${this.value}` : this.value;

            this.updateField({
                id: this.fieldIdForUpdate,
                value: newVal
            });
            this.touched = true;
        },
        handleSubmit: function() {
            if (this.viewMode == 'find') {
                this.searchProjectRecords();
            }
        },
        resetValue: function() {
            this.value = this.isNested ? this.field.value : this.$store.getters.getFieldVal(this.field.id),
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
        .input-container {
            display: flex;
        }
        &.find {
            .input-container {
                position: relative;
            }
            input, select {
                    background-color: #d9f6ff;
                }
        }

        input {
            &.touched {
                border: 2px solid #328d32;
                font-weight: bold;
            }
        }
    }
</style>