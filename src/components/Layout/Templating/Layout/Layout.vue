<template src="./Layout.html"></template>
<script>
import Section from '@/components/Layout/Templating/Section/Section';

export default {
    data: function() {
        return {
            layout: {
                name: 'Default Layout',
                hasWorkflow: true,
                id: 1,
                components: [
                    {
                        id: 1,
                        type: 'section',
                        width: 6,
                        components: [
                            {
                                id: 10,
                                type: 'field'
                            },
                            {
                                id: 11,
                                type: 'field'
                            }
                        ]
                    },
                    {
                        id: 2,
                        type: 'section',
                        width: 6,
                        components: [
                            {
                                id: 12,
                                type: 'field'
                            },
                            {
                                id: 13,
                                type: 'field'
                            }
                        ]
                    },
                    {
                        id: 3,
                        type: 'section',
                        width: 12,
                        components: [
                            {
                                id: 14,
                                type: 'field'
                            },
                            {
                                id: 15,
                                type: 'field'
                            }
                        ]
                    }
                ]
            }
        }
    },
    components: {
        'layout-section': Section
    }
}
</script>