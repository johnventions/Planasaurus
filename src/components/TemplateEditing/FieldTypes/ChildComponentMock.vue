<template>
    <div>
        <v-flex class="mb-3">
            <label class="mr-5">{{ field.name }}</label>
        </v-flex>
        <v-data-table
            dense
            :headers="headers"
            :items="items">
        </v-data-table>
    </div>
</template>
<script>
export default {
    props: [
        'field', 'type'
    ],
    data: function() {
        return {
            value: null
        }
    },
    watch: {
    },
    computed: {
        headers: function() {
            const meta = this.field.metadata || {};
            const fields = meta.fieldDisplay || [];
            return fields.map(x => {
                const f = this.$store.getters.getFieldDefintion(x.id) || {};
                return {
                    text: f.name,
                    value: x.id.toString(),
                    field: f
                };
            })
        },
        items: function() {
            const meta = this.field.metadata || {};
            const fields = meta.fieldDisplay || [];
            const singleEntry =  {};
            fields.forEach(x => {
                singleEntry[x.id] = "---";
            });
            return [singleEntry];
        }
    },
    methods: {
    },
    mounted: function() {
    }
}
</script>