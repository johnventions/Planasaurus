<template>
    <router-link :to="`/dash/${activeProjectType.codename}/${id}`">
        <v-btn text>
            <v-icon>
                mdi-arrow-right-bold-circle-outline
            </v-icon>
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