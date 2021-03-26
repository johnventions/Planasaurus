<template>
    <v-card-text>
        <v-card-title>
            {{ obj.name }}
        </v-card-title>
        <v-card-subtitle>{{ obj.qty }} records</v-card-subtitle>
        <v-card-actions>
            <v-btn :to="`/dash/${obj.codename}`">
                <font-awesome-icon icon="location-arrow" size="1x" />
                &nbsp; View
            </v-btn>
            <v-btn :to="`/dash/${obj.codename}/layout`">
                <font-awesome-icon icon="edit" size="1x" />
                &nbsp; Edit Layout
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('edit', obj.id)"
                title="Edit Settings">
                    <font-awesome-icon icon="cog" size="1x" />
            </v-btn>
        </v-card-actions>
        <br/>
        <slot></slot>
    </v-card-text>
</template>
<script>
export default {
    props: ['obj'],
}
</script>
<style lang="scss">
</style>