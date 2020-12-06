<template src="./Zone.html"></template>
<script>
import { mapGetters, mapActions } from 'vuex';
import fieldTypes from "@/data/fieldTypes";

import NewFieldModal from '../Modals/NewField'
import EditFieldModal from '../Modals/EditField'

export default {
    props: ["item", "index"],
    data: function() {
        return {
            creatingField: false,
            editingField: false,
            fieldInEdit: null,
        };
    },
    components: {
        'new-field-modal': NewFieldModal,
        'edit-field-modal': EditFieldModal
    },
    computed: {
        ...mapGetters([
            'activeFields'
        ]),
        modalNewField: function(){ 
            return `new_modal_${this.item.id}`;
        },
        modalEditField: function(){ 
            return `edit_modal_${this.item.id}`;
        }
    },
    methods: {
        ...mapActions([
            'createField'
        ]),
        getLayoutFieldDef(fieldID) {
            if (this.activeFields && this.activeFields.fields) {
                return this.activeFields.fields.find(x => x.id == fieldID);
            }
            return null;
        },
        getLayoutComponent(fieldID) {
            // find field definition
            let fieldDef = this.getLayoutFieldDef(fieldID);
            if (fieldDef) {
                // find matching component base on the data type
                let matchingComponent = fieldTypes.find( x => x.id == fieldDef.data_type);
                return matchingComponent.layoutComponent;
            }
            console.log("Could not find", fieldID)
        },
        newField() {
            this.$modal.show(this.modalNewField);
            this.creatingField = true;
            this.editingField = false;
        },
        submitCreateField: async function(pkg) {
            let newField = await this.createField(pkg);
            this.creatingField = false;

            if (newField) {
                // field was create
                // add field to Zone
                let newItem = { ... this.item };
                newItem.components.push({
                    id: newField.id
                });
                // pass new definition up to parent SECTION
                this.$emit('updatechild', this.index, newItem);
                this.$modal.hide(this.modalNewField);
                this.editField(newField.id);
            }
        },
        editField(id) {
            this.$modal.show(this.modalEditField);
            this.fieldInEdit = id;
            this.editingField = true;
        },
        finishEdit: function() {
            this.editingField = false;
            this.$modal.hide(this.modalEditField);
        }
    }
}
</script>
<style lang="scss">
    .zone {
        .zone-input {
            padding: 5px;
            &:hover {
                border: 1px dashed #3d3ae0;
            }
        }
        &.editing {
            .zone-container {
                min-height: 200px;
                padding: 15px;
                border: 1px dotted black;
            }
            .zone-new {
                display: inline-block;
                margin-top: 15px;
                border: 1px solid black;
                background: #3d3ae0;
                font-weight: bold;
                padding: 10px;
                color: white;
                &:hover {
                    opacity: 0.7;
                    cursor: pointer;
                }
            }
        }
    }
</style>