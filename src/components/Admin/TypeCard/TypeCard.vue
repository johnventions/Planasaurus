<template>
    <div>
        <v-card-title class="d-block headline font-weight-regular">
            {{ obj.name }}
            <v-btn class="float-right"
                @click="$emit('edit', obj.id)"
                title="Edit Settings">
                    <v-icon>
                        mdi-cog
                    </v-icon>
                </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-card-subtitle>{{ obj.qty }} records</v-card-subtitle>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text :to="`/dash/${obj.codename}`">
                    View <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
                <v-btn text :to="`/dash/${obj.codename}/layout`">
                    Layout <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-card-actions>
            <slot></slot>
        </v-card-text>
    </div>
</template>
<script>
export default {
    props: ['obj'],
}
</script>
<style lang="scss">
</style>