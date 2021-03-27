<template src="./TemplateZone.html"></template>
<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable'

import fieldTypes from "@/data/fieldTypes";

import NewFieldModal from '../Modals/NewField'
import EditFieldModal from '../Modals/EditField'

export default {
    name: 'TemplateZone',
    props: ["item", "index"],
    data: function() {
        return {
            creatingField: false,
            editingField: false,
            fieldInEdit: null,
            modalNewField: false,
            modalEditField: false
        };
    },
    components: {
        'new-field-modal': NewFieldModal,
        'edit-field-modal': EditFieldModal,
        'draggable': draggable
    },
    computed: {
        ...mapGetters([
            'activeFields'
        ]),
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
        fieldProps(fieldID) {
            let props = {};
            if (this.activeFields && this.activeFields.fields) {
                props.field = this.activeFields.fields.find(x => x.id == fieldID);
            }
            let fieldDef = this.getLayoutFieldDef(fieldID);
            if (fieldDef) {
                // find matching component base on the data type
                let matchingComponent = fieldTypes.find( x => x.id == fieldDef.data_type);
                if (matchingComponent) props.type = matchingComponent.type;
            }
            return props;
        },
        getLayoutComponent(fieldID) {
            // find field definition
            let fieldDef = this.getLayoutFieldDef(fieldID);
            if (fieldDef) {
                // find matching component base on the data type
                let matchingComponent = fieldTypes.find( x => x.id == fieldDef.data_type);
                if (matchingComponent) return matchingComponent.layoutComponent; 
            }
            console.log("Could not find", fieldID)
        },
        newField() {
            this.modalNewField = true;
            this.creatingField = true;
            this.editingField = false;
        },
        submitCreateField: async function(pkg) {
            let newField = await this.createField(pkg);
            this.creatingField = false;

            if (newField) {
                // field was created
                // add field to Zone
                let newItem = { ... this.item };
                newItem.components.push({
                    id: newField.id
                });
                // pass new definition up to parent SECTION
                this.$emit('updatechild', this.index, newItem);
                this.editField(newField.id);
                this.modalNewField = false;
            }
        },
        removeField: function(index) {
            let newItem = { ... this.item };
            newItem.components.splice(index, 1);
            this.$emit('updatechild', this.index, newItem);
        },
        editField(id) {
            this.fieldInEdit = id;
            this.editingField = true;
            this.modalEditField = true;
        },
        finishEdit: function() {
            this.editingField = false;
            this.modalEditField = false;
        },
        getComponentData: function(event) {
            console.log(event);
            //console.log(this.item.components[index]);
            // return this.item.components[index];
        },
        onDrop: function() {//event, originalEvent
            this.$emit('updatechild', this.index, this.item);
        },
        modifyDragItem (dataTransfer) {
            console.log(dataTransfer);
            let img = new Image()
            img.src = '/IMG_20160211_222436.jpg'
            dataTransfer.setDragImage(img, 0, 0)
        }
    }
}
</script>
<style lang="scss">
    .sortable-ghost {
        border: 1px dashed blue;
    }
    .zone {
        border: 1px dashed grey;
        
        .zone-input {
            display: flex;
            transition: opacity 0.5s ease, transform 0.25s ease;
            &:hover {
                opacity: 0.7;
            }

            > div {
                flex-grow: 1;
            }

            .handle {
                cursor: move;
                padding: 10px;
                border: 1px solid grey;
                border-radius: 4px;
                height: 35px;
                margin-right: 8px;
                display: none;
                @media screen and (min-width: 768px) {
                    display: block;
                }

                > svg {
                    display: block;
                }

            }
        }
        &.editing {
            .zone-container {
                padding: 15px;
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