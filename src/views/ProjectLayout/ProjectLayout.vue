<template>
    <div class="container">
        <div class="row">
            <div class="col-8">
                <layout></layout>
            </div>
            <div class="col-4">
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import Layout from '@/components/FormLayout/Layout/Layout';

export default {
    name: 'ProjectLayout',
    components: {
        'layout': Layout
    },
    data: function() {
        return {
            activeType: null,
        }
    },
    computed: mapState({
        projectTypes: state => state.projectTypes,
        activeFields: function(state) {
            let projectFields = state.projectFields[this.activeType];
            console.log(state.projectFields, projectFields);
            return projectFields || {};
        }
    }),
    watch: {
        $route(to, from) {
            if (to.params.type !== from.params.type) {
                this.processPath();
            }
        },
        projectTypes() {
            this.processPath();
        }
    },
    methods: {
        ...mapActions([
            'getProjectFields'
        ]),
        processPath: function() {
            this.activeType = this.$route.params.type;
            if (this.activeType != null) {
                this.getProjectFields(this.activeType);
            }
        }
    },
    mounted: function() {
        this.processPath();
    }
}
</script>