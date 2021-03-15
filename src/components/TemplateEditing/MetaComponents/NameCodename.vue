<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <v-text-field
                type="text"
                label="Name"
                v-on:change="handleNameUpdate"
                v-on:keyup="handleNameUpdate"
                v-model="nameValue"/>
        </div>
    </div>
</template>
<script>
export default {
    props: ['field'],
    data: function() {
        return {
            nameValue: '',
            codenameValue: ''
        };
    },
    methods: {
        handleNameUpdate(){
            this.$emit('updateFieldAttribute', 'name', this.nameValue);
        },
        handleCodeUpdate(){
            this.$emit('updateFieldAttribute', 'codename', this.codenameValue);
        },
    },
    mounted: function() {
        this.nameValue = this.field.name;
    }

}
</script>