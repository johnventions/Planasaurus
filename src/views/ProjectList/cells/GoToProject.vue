<template>
    <router-link :to="`/dash/${activeProjectType.codename}/${id}`">
        <button class="btn btn-primary">
            View
        </button>
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