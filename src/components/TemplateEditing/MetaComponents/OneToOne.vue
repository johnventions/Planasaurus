<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <label>
                Date Type:
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
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
    props: ['field'],
    data: function() {
        return {
            related_type: '',
        };
    },
    computed: {
        ...mapState({
            projectTypes: state => state.projectTypes
        })
    },
    methods: {
        handleRelationshipUpdate(){
            this.$emit('updateFieldAttribute', 'relationship_type', this.related_type);
        }
    },
    mounted: function() {
        this.related_type = this.field.relationship_type;
    }

}
</script>