<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <label>
                Maximum Allowed Uploads
            </label><br/>
            <input type="text"
                v-on:change="handleQuantityUpdate"
                v-on:keyup="handleQuantityUpdate"
                v-model="qtyValue"/>
        </div>
        <div class="col-12 col-md-6">
            <label>
                Display Format
            </label><br/>
            <select v-on:change="handleDisplayUpdate" v-model="displayValue">
                <option value="list">List</option>
                <option value="thumbnail">Thumbnails</option>
            </select>
        </div>
    </div>
</template>
<script>
export default {
    props: ['field'],
    data: function() {
        return {
            qtyValue: '',
            displayValue: '',
            codenameValue: ''
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