<template>
    <div>
        <div v-for="(child, i) in item.sections" :key="child.id">
            {{ child }} {{ i }}
        </div>
    </div>
</template>
<script>
export default {
    props: ['item']
    
}
</script>