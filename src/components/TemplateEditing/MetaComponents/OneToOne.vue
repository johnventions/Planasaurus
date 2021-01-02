<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <label>
                Data Type:
            </label><br/>
            <select 
                v-on:change="handleRelationshipUpdate"
                v-model="related_type">
                <option v-for="type in projectTypes" 
                    :value="type.id" 
                    :key="type.id">
                    {{ type.name }}
                </option>
            </select>
        </div>
        <div class="col-12 col-md-6" v-if="fieldsForType.length">
            <label>
                Primary Field:
            </label><br/>
            <select 
                v-on:change="handleKeysUpdate"
                v-model="related_keys">
                <option v-for="typeField in fieldsForType" 
                    :value="typeField.id" 
                    :key="typeField.id">
                    {{ typeField.name }}
                </option>
            </select>
        </div>
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