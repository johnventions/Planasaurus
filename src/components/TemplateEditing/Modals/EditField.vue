<template>
    <div>
        <div v-if="currentFieldType">
            <div v-for="(meta, i) in currentFieldType.metaComponents" :key="i">
                <div :is="meta"
                    :field="currentFieldDef"
                    v-on:updateField="handleUpdate"></div>
            </div>
        </div>
        <button class="btn btn-primary"
            v-if="changes > 0"
            @click="saveChanges">
            Save changes
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
            if (key == "name") {
                this.editedFieldDef.name = value;
            } else {
                this.$set(this.editedFieldDef.metadata, key, value);
            }
            this.changes++;
        },
        saveChanges: function() {
            console.log(this.editedFieldDef);
            axios.put(`/api/types/fields/${this.editedFieldDef.id}`, this.editedFieldDef)
                .then((response) => {
                    console.log(response);
                });
        }
    },
    mounted: function() {
        this.editedFieldDef = { ... this.currentFieldDef };
    }
}
</script>

<style lang="scss" scoped>
    button {
        margin-top: 20px;
    }
</style>