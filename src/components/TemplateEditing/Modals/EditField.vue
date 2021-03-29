<template>
    <v-card class="edit-field">
        <v-card-title class="headline font-weight-regular light-blue white--text">
            Field Settings
        </v-card-title>
        <v-card-title>
        </v-card-title>
        <div class="px-6" v-if="editedFieldDef && currentFieldType">
            <div v-for="(meta, i) in currentFieldType.metaComponents" :key="i">
                <div :is="meta"
                    :field="editedFieldDef"
                    v-on:updateFieldAttribute="handleUpdate"
                    v-on:updateFieldMeta="handleMetaUpdate"></div>
            </div>
        </div>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="$emit('edit-finish')">
                Close
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                @click="saveChanges">
                Save
            </v-btn>
        </v-card-actions>
         <v-progress-linear
            v-if="loading"
            indeterminate
            color="cyan"
            ></v-progress-linear>
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
            loading: false
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
            this.loading = true;
            axios.put(`/api/types/fields/${this.editedFieldDef.id}`, this.editedFieldDef)
                .then((response) => {
                    // update field
                    this.loading = false;
                    this.$emit("edit-finish", response.data.field);
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