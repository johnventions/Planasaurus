<template>
    <div>
        <h3>New Field</h3>
        <label>Field Name</label>
        <input type="text" v-model="fieldName"/>
        <div class="row">
            <div class="col-6"
                v-for="(field) in fieldTypes" :key="field.id">
                <button
                    class="btn"
                    :class="{
                        'btn-dark': field.id !== fieldType,
                        'btn-success': field.id == fieldType
                    }"
                    @click="selectType(field)">
                    {{ field.name }}
                </button>
            </div>
        </div>
        <button class="btn btn-primary" @click="submit">
            Create
        </button>
    </div>
</template>

<style scoped>
    button {
        width: 100%;
        margin-bottom: 10px;
    }
</style>

<script>
import fieldTypes from "@/data/fieldTypes";

export default {
    data: function() {
        return {
            fieldName: '',
            fieldType: null,
        }
    },
    computed: {
        fieldTypes: () => fieldTypes
    },
    methods: {
        selectType(field) {
            console.log(field);
            this.fieldType = field.id;
        },
        submit() {
            console.log("create field");
            this.$emit('createField', {
                name: this.fieldName,
                type: this.fieldType,
            });
        }
    }
}
</script>