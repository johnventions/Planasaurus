<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <div class="input-container">
            <v-select 
                class="search-operator"
                :items="searchOptions"
                item-text="key"
                item-value="value"
                v-model="searchOperator"
                v-if="viewMode == 'find' && useSearchOperators">
            </v-select>

            <v-text-field
                :label="field.name"
                :dense="isNested"
                v-if="type == 'text'"
                :hide-details="isNested? true : false"
                :single-line="isNested? true : false"
                :placeholder="field.name"
                v-bind:class="{touched: touched}"
                v-on:change="handleUpdate"
                v-on:keyup="handleUpdate"
                v-on:keyup.enter="handleSubmit"
                v-model="value"
            ></v-text-field>

            <v-menu
                v-if="type == 'date'"
                v-model="dateMenu"
                :close-on-content-click="false"
                max-width="290">
                <template 
                    v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :value="value"
                        :label="field.name"
                        :placeholder="field.name"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="value = null"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="value"
                    v-on:change="handleUpdate"
                ></v-date-picker>
            </v-menu>
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
            dateMenu: false,
            value: this.isNested ? this.field.value : this.$store.getters.getFieldVal(this.field.id),
            touched: false,
            searchOperator: null,
            searchOptions: [
                { key: '=', value: null},
                { key: '>', value: '>'},
                { key: '<', value: '<'},
            ]
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
            this.dateMenu = false;

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
            } else if (mutation.type == "SAVE_COMPLETE") {
                this.touched = false;
            }
        });
    }
}
</script>
<style lang="scss" scoped>
    .input-container {
        display: flex;

        .search-operator {
            max-width: 45px;
            margin-right: 10px;
        }
    }
</style>