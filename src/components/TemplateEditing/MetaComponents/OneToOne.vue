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
import { mapState } from 'vuex';

export default {
    props: ['field'],
    data: function() {
        return {
            related_type: '',
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
        handleRelationshipUpdate(){
            this.$emit('updateFieldAttribute', 'relationship_type', this.related_type);
        },
        handleKeysUpdate(){
            this.$emit('updateFieldAttribute', 'related_keys', this.related_keys);
        }
    },
    mounted: function() {
        this.related_type = this.field.relationship_type;
        this.related_keys = this.field.related_keys;
    }

}
</script>