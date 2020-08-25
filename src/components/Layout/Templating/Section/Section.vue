<template src="./Section.html"></template>
<script>
export default {
    name: 'Section',
    props: ['item'],
    methods: {
        getClass() {
            return `col-${this.item.width}`;
        },
        isContainer() {
            let childSections = this.item.components.filter( x => x.type == 'section');
            return childSections.length > 0;
        }
    }
}
</script>