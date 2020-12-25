<template>
    <div>
        <h3>New Field</h3>
        <label>Field Name</label>
        <input type="text" v-model="fieldName"/>
        <button
            class="btn"
            :class="{
                'btn-dark': field.id !== fieldType,
                'btn-success': field.id == fieldType
            }"
            @click="selectType(field)"
            v-for="(field) in fieldTypes" :key="field.id">
            <div class="row">
                    <div class="col-2 field-icon">
                        <font-awesome-icon :icon="field.icon" size="2x"/>
                    </div>
                    <div class="col-10">
                        <h4>
                            {{ field.name }}
                        </h4>
                        <p>
                            {{ field.description}}
                        </p>
                    </div>
            </div>
        </button>

        <button class="btn btn-primary" @click="submit">
            Create
        </button>
    </div>
</template>

<style lang="scss" scoped>
    button {
        width: 100%;
        margin-bottom: 10px;
        text-align: left;
        padding: 15px;

        .field-icon {
            text-align: center;
        }

        p {
            margin-bottom: 0;
        }
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
            this.$emit('createField', {
                name: this.fieldName,
                data_type: this.fieldType,
            });
        }
    }
}
</script>