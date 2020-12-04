<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <label>
                Name
            </label><br/>
            <input type="text"
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
            this.$emit('updateField', 'name', this.nameValue);
        },
        handleCodeUpdate(){
            this.$emit('updateField', 'codename', this.codenameValue);
        },
    },
    mounted: function() {
        this.nameValue = this.field.name;
    }

}
</script>