<template>
    <router-link :to="`/dash/${activeProjectType.codename}/${id}`">
        <v-btn color="deep-purple" dark>
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