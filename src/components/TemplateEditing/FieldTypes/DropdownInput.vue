<template>
    <div class="form-group">
        <v-select :label="field.name" 
            :items="field.metadata.options || []"
            class="form-control">
        </v-select>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>