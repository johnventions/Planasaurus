<template src="./Zone.html"></template>
<script>
import { mapGetters } from 'vuex';
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
        ])
    },
    methods: {
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
                if (matchingComponent) return matchingComponent.type;
            }
            return null;
        },
        getLayoutComponent(fieldID) {
            // find field definition
            let fieldDef = this.getLayoutFieldDef(fieldID);
            if (fieldDef) {
                // find matching component base on the data type
                let matchingComponent = fieldTypes.find( x => x.id == fieldDef.data_type);
                if (matchingComponent) return matchingComponent.editingComponent;
            }
            console.log("Could not find", fieldID)
        }
    }
}
</script>
<style lang="scss">
    .zone {
        .field-item {
            margin-bottom: 10px;
        }
        &.editing {
            + .zone {
                border-left: 1px dashed grey;
            }
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