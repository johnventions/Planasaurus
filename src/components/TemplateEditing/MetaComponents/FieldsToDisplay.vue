<template>
    <div>
        <v-card-title class="px-0">
            Fields to Display
        </v-card-title>
        <v-row class="mx-0">
            <v-select v-model="pendingAdd"
                :items="fieldOptions"
                item-text="name"
                item-value="id">
            </v-select>
            <v-btn color="primary"
                @click="addOption"
                class="mt-3">
                Add
            </v-btn>
        </v-row>
        <v-list>
            <v-list-item dense v-for="(item, i) in fieldMapping" :key="i">
                <v-list-item-content>
                    {{ item.name }}
                </v-list-item-content>
                <v-list-item-action dense>
                    <v-btn icon>
                        <v-icon dense 
                            @click="removeField(item)"
                            color="red lighten-1">
                            mdi-trash-can
                        </v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>
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