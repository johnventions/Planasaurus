<template>
    <div class="form-group">
        <v-switch
            inset
            v-model="value"
            v-on:change="handleUpdate"
            :label="field.name"
        ></v-switch>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
    props: [
        'field',
        'type',
        'isNested',
        'parentField'
    ],
    data: function() {
        return {
            value: parseInt(this.isNested ? this.field.value : this.$store.getters.getFieldVal(this.field.id)),
            touched: false
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
        handleUpdate: function(){
            const newVal = (this.viewMode == 'find' && this.searchOperator) ? `${this.searchOperator}${this.value}` : this.value;
            this.dateMenu = false;

            this.updateField({
                id: this.fieldIdForUpdate,
                value: newVal
            });
            this.touched = true;
        },
        resetValue: function() {
            this.value = parseInt(this.isNested ? this.field.value : this.$store.getters.getFieldVal(this.field.id)),
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