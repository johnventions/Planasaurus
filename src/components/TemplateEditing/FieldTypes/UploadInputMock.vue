<template>
    <div class="form-group">
        <v-row class="mb-3">
            <v-file-input
                disabled
                :label="field.name"
            ></v-file-input>
        </v-row>
    </div>
</template>
<script>
export default {
    props: [
        'field', 'isNested', 'type'
    ],
    data: function() {
        return {
            value: null
        }
    },
    watch: {
    },
    computed: {
    },
    methods: {
    },
    mounted: function() {
    }
}
</script>