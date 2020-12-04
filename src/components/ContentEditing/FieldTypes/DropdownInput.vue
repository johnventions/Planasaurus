<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <select class="form-control"
                v-model="value"
                v-on:change="handleUpdate">
            <option disabled selected>Select One</option>
            <option value="a">A</option>
            <option value="b">B</option>
        </select>
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
            value: this.$store.getters.getFieldVal(this.field.id)
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
        })
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
        },
        resetValue() {
            this.value = this.$store.getters.getFieldVal(this.field.id);
        }
    },
    mounted: function() {
        this.$store.subscribe((mutation) => {
            if (mutation.type == "SET_RECORD") {
                this.resetValue();
            }
        });
    }
}
</script>