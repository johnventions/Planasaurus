<template src="./LayoutArea.html"></template>
<script>
import Vue from 'vue';
import LayoutSection from '@/components/TemplateEditing/Section/Section';
import Section from '@/models/class.section';


export default {
    props: ['area', 'areaname'],
    data: function() {
        return {
        }
    },
    components: {
        'layout-section': LayoutSection
    },
    methods: {
        newSection(i) {
            this.newSectionIndex = i + 1;
            this.$modal.show('new-section-modal');
        },
        createSection(type) {
            // create new section at the index
            let newArea = {...this.area };
            newArea.sections.splice(this.newSectionIndex, 0, Section.create(type));
            // push that bad boy live
            this.updateMe(newArea);
            this.$modal.hide('new-section-modal');
        },
        handleUpdateChild(index, item) {
            let newArea = {...this.area };
            Vue.set(newArea.sections, index, item);
            this.updateMe(newArea);
        },
        updateMe(obj) {
            this.$emit('updateArea', this.areaname, obj);
        }
    }
}
</script>

<style lang="scss">
    .section-container {
        position: relative;
    }
    .section-choices {
        button {
            width: 100%;
            margin-bottom: 10px;
        }
    }
    .section-new {
            border-radius: 20%;
            border: 1px solid black;
            width: 30px;
            height: 30px;
            position: absolute;
            left: -35px;
            bottom: -16px;
            z-index: 20;
            text-align: center;
            color: white;
            font-size: 18px;
            font-weight: 800;
            cursor: pointer;
            padding: 0;
        }
</style>