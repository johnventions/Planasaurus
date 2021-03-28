<template>
    <div class="form-group">
        <v-switch
            inset
            :label="field.name"
        ></v-switch>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>