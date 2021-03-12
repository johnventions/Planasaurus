<template src="./LayoutArea.html"></template>
<script>
import Vue from 'vue';
import LayoutSection from '@/components/TemplateEditing/Section/Section';
import Section from '@/models/class.section';


export default {
    props: ['area', 'areaname'],
    data: function() {
        return {
            newSectionIndex: null,
            targetSectionId: null,
        }
    },
    components: {
        'layout-section': LayoutSection
    },
    methods: {
        newSection(i) {
            this.newSectionIndex = i + 1;
            this.targetSectionId = null;
            this.$modal.show('new-section-modal');
        },
        editSection(id) {
            console.log(id);
            this.newSectionIndex = null;
            this.targetSectionId = id;
            this.$modal.show('new-section-modal');
        },
        createSection(type) {
            // create new section at the index
            let newArea = {...this.area };
            if (this.targetSectionId) {
                const index = this.area.sections.findIndex(x => x.id == this.targetSectionId);
                if (index != null) {
                    // update the existing section
                    const existing = { ... this.area.sections[index] };
                    const newSection = Section.create(type);
                    let maxIndex = -1;
                    newSection.zones.forEach((x, i) => {
                        // copy zones that exist in both
                        if (existing.zones[i]) {
                            newSection.zones[i] = { ... existing.zones[i] };
                        }
                        maxIndex++;
                    });
                    if (maxIndex < existing.zones.length - 1) {
                        // example: old section had 3, new had 1
                        // move items in 2 and 3 to zone 1o
                        const lastZone = newSection.zones[maxIndex];
                        for(var i = maxIndex + 1; i < existing.zones.length; i++) {
                            // add components from existing slot
                            lastZone.components = [
                                ... lastZone.components,
                                ... existing.zones[i].components
                            ];
                            newSection.zones[maxIndex] = lastZone;
                        }
                    }
                    newArea.sections[index] = newSection;
                } 
            } else {
                newArea.sections.splice(this.newSectionIndex, 0, Section.create(type));
            }
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
    .section-new, .section-edit {
        position: absolute;
        z-index: 20;
        text-align: center;
        cursor: pointer;
    }
    .section-new {
        left: -35px;
        bottom: -16px;
        position: absolute;
    }
    .section-edit {
        right: -15px;
        top: -5px;
    }

</style>