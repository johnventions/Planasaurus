<template>
    <v-card>
        <v-card-title>
            New Field
        </v-card-title>
        <v-card-text>
            <v-text-field label="Field name" v-model="fieldName"/>
            <v-list>
                <v-list-item-group
                    mandatory
                    v-model="fieldTypeIndex">
                    <v-list-item
                        dense
                        color="secondary"
                        v-for="(field) in fieldTypes" :key="field.id">
                        <v-list-item-icon>
                            <v-icon v-text="field.icon"/>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <h4>
                                {{ field.name }}
                            </h4>
                            <p>
                                {{ field.description}}
                            </p>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            <v-btn class="btn btn-primary" @click="submit">
                Create
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
import fieldTypes from "@/data/fieldTypes";

export default {
    data: function() {
        return {
            fieldName: '',
            fieldTypeIndex: 0,
        }
    },
    computed: {
        fieldTypes: () => fieldTypes
    },
    methods: {
        submit() {
            const t = fieldTypes[this.fieldTypeIndex];
            
            this.$emit('createField', {
                name: this.fieldName,
                data_type: t.id,
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    button {
        h4 {
            margin-bottom: 0;
        }
        .field-icon {
            text-align: center;
        }
    }
</style>