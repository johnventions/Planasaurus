<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <label>{{ field.name }}</label><br/>
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
    props: [
        'field', 'type'
    ],
    data: function() {
        return {
            value: this.$store.getters.getFieldVal(this.field.id),
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
        handleUpdate(){
            const newVal = (this.viewMode == 'find' && this.searchOperator) ? `${this.searchOperator}${this.value}` : this.value;

            this.updateField({
                id: this.field.id,
                value: newVal
            });
            this.touched = true;
        },
        handleSubmit() {
            if (this.viewMode == 'find') {
                this.searchProjectRecords();
            }
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
        .input-container {
            display: flex;
        }
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