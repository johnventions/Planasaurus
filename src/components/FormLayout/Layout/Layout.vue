<template src="./Layout.html"></template>
<script>
import LayoutSection from '@/components/FormLayout/Section/Section';
import Area from '../models/class.area';
import Section from '../models/class.section';
import dummyarea from "./dummyarea";


export default {
    data: function() {
        return {
            layout: {
                name: 'Default Layout',
                hasWorkflow: true,
                id: 1,
                primaryArea: new Area(dummyarea)
            },
            newSectionIndex: -1
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
            let newSection = Section.create(type);
            this.layout.primaryArea.sections.splice(this.newSectionIndex, 0, newSection);
             this.$modal.hide('new-section-modal');

        }
    }
}
</script>

<style lang="scss">
    .section-container {
        position: relative;
    }
    .section-new {
            border-radius: 50%;
            border: 1px solid black;
            width: 30px;
            height: 30px;
            position: absolute;
            left: -15px;
            bottom: -16px;
            z-index: 20;
            text-align: center;
            background: coral;
            font-weight: bold;
            cursor: pointer;
            &:hover {
                background: lightcoral;
            }
        }
</style>