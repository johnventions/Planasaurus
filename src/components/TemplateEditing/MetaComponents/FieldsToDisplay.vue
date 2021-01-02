<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <label>
                Data to Display:
            </label><br/>
            <ul class="dropdown-options">
                <li v-for="(item, i) in fieldMapping" :key="i">
                    {{ item.name }}
                    <button v-on:click="removeField(item)">
                        x
                    </button>
                </li> 
            </ul>
        </div>
        <div class="col-12 col-md-6">
            <label>
                Add new fields
            </label><br/>
            <select v-model="pendingAdd">
                <option v-for="(opt, i) in fieldOptions"
                    :value="opt.id"
                    :key="i">
                    {{ opt.name }}
                </option>
            </select><br/>
            <button class="btn btn-primary" @click="addOption">
                Add Option
            </button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'FieldsToDisplay',
    props: ['field'],
    data: function() {
        return {
            pendingAdd: null,
            value: [],
        };
    },
    computed: {
        fieldOptions: function() {
            return this.$store.getters.getFieldsByTypeId(this.field.relationship_type);
        },
        fieldMapping: function() {
            let fields =  this.$store.getters.getFieldsByTypeId(this.field.relationship_type);
            return this.value.map(x => {
                            return fields.find(y => y.id == x.id );
                        });
        },
    },
    methods: {
        handleUpdate: function(){
            this.$emit('updateFieldMeta', 'fieldDisplay', this.value);
        },
        addOption: function() {
            if (this.pendingAdd == null) return;
            this.value = [ ...this.value, { id: this.pendingAdd}];
            this.handleUpdate();
            this.pendingAdd = null;
        },
        removeField: function(item) {
            this.value = this.value.filter(x => x.id !== item.id);
        }

    },
    mounted: function() {
        if (this.field.metadata) {
            this.value = this.field.metadata.fieldDisplay || [];
        } else {
            this.value = [];
        }
    }

}
</script>
<style lang="scss">
    .dropdown-options {
        padding-left: 0px;
        li {
            list-style: none;
            padding: 5px;
            &:nth-child(odd) {
                background: #d4d9da;
            }
        }
    }
</style>