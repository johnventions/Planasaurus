<template>
    <v-card class="edit-field">
        <v-card-text>
            Edit Field
        </v-card-text>
        <v-card-text>
            <div v-if="currentFieldType">
                <div v-for="(meta, i) in currentFieldType.metaComponents" :key="i">
                    <div :is="meta"
                        :field="currentFieldDef"
                        v-on:updateFieldAttribute="handleUpdate"
                        v-on:updateFieldMeta="handleMetaUpdate"></div>
                </div>
            </div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="$emit('edit-finish')">
                    Finish
                </v-btn>
                <v-btn
                    color="green darken-1"
                    text
                    @click="saveChanges">
                    Save
                </v-btn>
                </v-card-actions>
        </v-card-text>
    </v-card>
</template>
<script>
import axios from 'axios';
import fieldTypes from "@/data/fieldTypes";

export default {

    props: ['field'],
    data: function() {
        return {
            editedFieldDef: null,
            changes: 0,
        }
    },
    computed: {
        currentFieldDef: function() {
            const fieldDef = this.$store.getters.getFieldDefintion(this.field);
            if (fieldDef) {
                return fieldDef;
            }
            return {};
        },
        currentFieldType: function() {
            const fieldDef = this.$store.getters.getFieldDefintion(this.field);
            if (fieldDef) {
                const fieldType = fieldTypes.find(x => x.id == fieldDef.data_type);
                return fieldType;
            }
            return null;
        }
    },
    methods: {
        handleUpdate: function(key, value) {
            this.editedFieldDef[key] = value;
            this.changes++;
        },
        handleMetaUpdate: function(key, value) {
            if (this.editedFieldDef.metadata == null) {
                this.editedFieldDef.metadata = [];
            }
            this.$set(this.editedFieldDef.metadata, key, value);
            this.changes++;
        },
        saveChanges: function() {
            console.log(this.editedFieldDef);
            axios.put(`/api/types/fields/${this.editedFieldDef.id}`, this.editedFieldDef)
                .then((response) => {
                    console.log(response);
                    this.$emit("edit-finish");
                });
        }
    },
    mounted: function() {
        this.editedFieldDef = { ... this.currentFieldDef };
    }
}
</script>

<style lang="scss">
    .edit-field {
        button.save {
            margin-top: 20px;
        }
        
        label {
            font-weight: bold;
        }
    }
    
</style>