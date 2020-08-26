<template src="./Layout.html"></template>
<script>
import Section from '@/components/FormLayout/Section/Section';
import Area from '../models/class.area';
import dummyarea from "./dummyarea";


export default {
    data: function() {
        return {
            layout: {
                name: 'Default Layout',
                hasWorkflow: true,
                id: 1,
                primaryArea: new Area(dummyarea)
            }
        }
    },
    components: {
        'layout-section': Section
    }
}
</script>