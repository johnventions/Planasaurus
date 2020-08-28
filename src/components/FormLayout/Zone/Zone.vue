<template src="./Zone.html"></template>
<script>
import { mapGetters, mapActions } from 'vuex';
import NewFieldModal from '../Modals/NewField'
import fieldTypes from "@/data/fieldTypes";

export default {
    props: ["item"],
    data: function() {
        return {
        };
    },
    components: {
        'new-field-modal': NewFieldModal
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
            this.$modal.show(this.modalName);
        },
        async submitCreateField(pkg) {
            let newField = await this.createField(pkg);
            console.log(newField);
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
                background: lightblue;
                border: 1px solid black;
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