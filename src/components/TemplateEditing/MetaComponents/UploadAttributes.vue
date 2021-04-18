<template>
    <div class="">
        <v-text-field
            label="Maximum Allowed Uploads"
            placeholder="(0 for no limit)"
            v-on:change="handleQuantityUpdate"
            v-on:keyup="handleQuantityUpdate"
            v-model="qtyValue"/>
        <v-select 
            label="Display Format"
            :items="options"
            v-on:change="handleDisplayUpdate" 
            v-model="displayValue">
        </v-select>
    </div>
</template>
<script>
export default {
    props: ['field'],
    data: function() {
        return {
            qtyValue: null,
            displayValue: null,
            options: [
                {
                text: "List",
                value: "list"
                },
                {
                text: "Thumbnails",
                value: "thumbnail"
                },
            ]
        };
    },
    methods: {
        handleQuantityUpdate(){
            this.$emit('updateFieldMeta', 'itemQty', this.qtyValue);
        },
        handleDisplayUpdate(){
            this.$emit('updateFieldMeta', 'display', this.displayValue);
        },
    },
    mounted: function() {
        if (this.field.metadata) {
            this.qtyValue = this.field.metadata.itemQty || null;
            this.displayValue = this.field.metadata.display || "list";
        } else {
            this.qtyValue = 0;
        }
    }

}
</script>