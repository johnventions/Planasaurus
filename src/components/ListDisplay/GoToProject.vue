<template>
    <router-link :to="destination">
        <v-btn text>
            <v-icon>
                mdi-arrow-right-bold-circle-outline
            </v-icon>
        </v-btn>
    </router-link>
    
</template>
<script>
export default {
    name: 'GoToProjectButton',
    props: [
        'id', 'item'
    ],
    computed: {
        destination: function() {
            const goto = this.item.APP_VIEW;
            return  `/dash/${goto.codename}/${goto.id}`;
        }
    },
    methods: {
    }
}
</script>