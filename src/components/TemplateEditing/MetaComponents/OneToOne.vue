<template>
    <div>
        <v-select 
            label="Data Type"
            v-on:change="handleRelationshipUpdate"
            v-model="related_type"
            :items="projectTypes"
            item-text="name"
            item-value="id">
        </v-select>
        <v-select 
            class="ml-8"
            label="Primary Field"
            v-on:change="handleKeysUpdate"
            v-model="related_keys"
            :items="fieldsForType"
            item-text="name"
            item-value="id">
        </v-select>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'OneToOne',
    props: ['field'],
    data: function() {
        return {
            related_type: null,
            related_keys: '',
        };
    },
    computed: {
        ...mapState({
            projectTypes: state => state.projectTypes
        }),
        fieldsForType: function() {
            let fields =  this.$store.getters.getFieldsByTypeId(this.related_type);
            return fields;
        }
    },
    methods: {
        ...mapActions([
            'getProjectFieldsByType'
        ]),
        ensureFields() {
            if (this.related_type) {
                this.getProjectFieldsByType({
                    id: this.related_type
                });
            }
        },
        handleRelationshipUpdate(){
            this.$emit('updateFieldAttribute', 'relationship_type', this.related_type);
            this.ensureFields();
        },
        handleKeysUpdate(){
            this.$emit('updateFieldAttribute', 'related_keys', this.related_keys);
        }
    },
    mounted: function() {
        this.related_type = this.field.relationship_type;
        this.related_keys = this.field.related_keys;
        this.ensureFields();
    }

}
</script>