<template>
    <div>
        <layout-section 
            v-for="(child, i) in item.sections" 
            :item="child"
            :index="i"
            :key="child.id">
        </layout-section>
    </div>
</template>
<script>
import Section from '../Section/Section';
export default {
    props: ['item'],
    components: {
        'layout-section': Section
    }
    
}
</script>