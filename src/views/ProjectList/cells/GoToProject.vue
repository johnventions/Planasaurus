<template>
    <router-link :to="`/dash/${activeProjectType.codename}/${id}`">
        <v-btn>
            View
        </v-btn>
    </router-link>
    
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'GoToProjectButton',
    props: [
        'id'
    ],
    computed: {
        ...mapGetters([
            'activeProjectType'
        ])
    },
    methods: {
    }
}
</script>