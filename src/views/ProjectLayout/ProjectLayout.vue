<template>
    <div class="container">
        <button class="btn btn-primary" @click="saveLayout">
            Save Layout
        </button>
        <div class="row">
            <div class="col-8">
                <layout-area 
                    v-if="activeLayout && activeLayout.layout"
                    v-on:updateArea="handleUpdateArea"
                    areaname="primaryArea"
                    :area="activeLayout.layout.primaryArea">
                </layout-area>
            </div>
            <div class="col-4">
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

import LayoutArea from '@/components/FormLayout/LayoutArea/LayoutArea';

export default {
    name: 'ProjectLayout',
    components: {
        'layout-area': LayoutArea
    },
    data: function() {
        return {
            activeType: null,
        }
    },
    computed: {
        ...mapGetters([
            'activeFields',
            'activeLayout'
        ]),
        ...mapState({
            activeProjectType: state => state.activeProjectType,
            projectTypes: state => state.projectTypes
        }),
    },
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
            'getProjectFields',
            'getProjectLayout',
            'saveLatestLayout'
        ]),
        ...mapMutations({
           modifyArea: 'MODIFY_LAYOUT_AREA'
        }),
        processPath: function() {
            this.activeType = this.$route.params.type;
            if (this.activeType != null) {
                this.getProjectFields(this.activeType);
                this.getProjectLayout(this.activeType);
            }
        },
        handleUpdateArea(name, obj) {
            console.log(name, obj);
            let update = {
                type: this.activeProjectType,
                areaName: name,
                area: obj
            };
            this.modifyArea(update);
        },
        saveLayout() {
            let pkg = {
                layout: this.activeLayout.layout
            };
            this.saveLatestLayout(pkg);
        }
    },
    mounted: function() {
        this.processPath();
    }
}
</script>