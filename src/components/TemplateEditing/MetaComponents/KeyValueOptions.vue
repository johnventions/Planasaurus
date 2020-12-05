<template>
    <div class="row">
        <div class="col-12">
            <label>
                Options
            </label><br/>
            <input v-model="inputValue">
            <button class="btn btn-primary" @click="addOption">
                Add Option
            </button>
            <ul class="dropdown-options">
                <li v-for="(item, i) in value" :key="i">
                    {{ item }}
                </li> 
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: ['field'],
    data: function() {
        return {
            inputValue: '',
            value: [],
        };
    },
    methods: {
        handleNameUpdate: function(){
            this.$emit('updateField', 'options', this.value);
        },
        addOption: function() {
            if (this.inputValue == '') return;
            this.value.push(this.inputValue);
            this.handleNameUpdate();
        }
    },
    mounted: function() {
        this.value = this.field.metadata.options || [];
    }

}
</script>
<style lang="scss">
    .dropdown-options {
        padding-left: 0px;
        li {
            list-style: none;
            padding: 5px;
            &:nth-child(odd) {
                background: #d4d9da;
            }
        }
    }
</style>