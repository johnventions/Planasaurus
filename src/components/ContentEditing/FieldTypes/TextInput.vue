<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <input type="text" 
            class="form-control"
            v-on:change="handleUpdate"
            v-model="value"/>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
    props: [
        'field'
    ],
    data: function() {
        return {
            value: this.$store.getters.getFieldVal(this.field.id)
        }
    },
    computed: {
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
        }
    }
}
</script>