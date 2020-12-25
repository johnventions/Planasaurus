<template>
    <div class="edit-field">
        <div v-if="currentFieldType">
            <div v-for="(meta, i) in currentFieldType.metaComponents" :key="i">
                <div :is="meta"
                    :field="currentFieldDef"
                    v-on:updateFieldAttribute="handleUpdate"
                    v-on:updateFieldMeta="handleMetaUpdate"></div>
            </div>
        </div>
        <button class="btn btn-primary save"
            v-if="changes > 0"
            @click="saveChanges">
            Save changes
        </button>
        <button class="btn btn-primary save"
            v-if="changes == 0"
            @click="$emit('edit-finish')">
            Finish
        </button>
    </div>
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