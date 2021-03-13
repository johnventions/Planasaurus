<template>
    <div class="form-group">
        <v-text-field
            :label="field.name"
            :dense="isNested"
            :hide-details="isNested? true : false"
            :placeholder="field.name"
        ></v-text-field>
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