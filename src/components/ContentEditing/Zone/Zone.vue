<template src="./Zone.html"></template>
<script>
import { mapGetters, mapActions } from 'vuex';
import fieldTypes from "@/data/fieldTypes";

export default {
    props: ["item", "index"],
    data: function() {
        return {
        };
    },
    components: {
    },
    computed: {
        ...mapGetters([
            'activeFields'
        ]),
        modalName: function(){ 
            return `new_modal_${this.item.id}`;
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
        getLayoutFieldType(fieldID) {
            let fieldDef = this.getLayoutFieldDef(fieldID);
            if (fieldDef) {
                // find matching component base on the data type
                let matchingComponent = fieldTypes.find( x => x.id == fieldDef.data_type);
                return matchingComponent.type;
            }
            return null;
        },
        getLayoutComponent(fieldID) {
            // find field definition
            let fieldDef = this.getLayoutFieldDef(fieldID);
            if (fieldDef) {
                // find matching component base on the data type
                let matchingComponent = fieldTypes.find( x => x.id == fieldDef.data_type);
                return matchingComponent.editingComponent;
            }
            console.log("Could not find", fieldID)
        },
        newField() {
            this.$modal.show(this.modalName);
        },
        async submitCreateField(pkg) {
            let newField = await this.createField(pkg);
            if (newField) {
                // field was create
                this.$modal.hide(this.modalName);
                // add field to Zone
                let newItem = { ... this.item };
                newItem.components.push({
                    id: newField.id
                });
                // pass new definition up to parent SECTION
                this.$emit('updatechild', this.index, newItem);
            }
        }
    }
}
</script>
<style lang="scss">
    .zone {
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