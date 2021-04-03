<template>
    <div>
        <template v-for="attach in attachmentArray">
            <v-avatar 
                :title="attach.filename"
                class="mr-1"
                color="secondary"
                :key="attach.id">
                <v-img :src="attach.previewPath"  v-if="attach.previewPath"/>
                <v-icon v-else dark>
                    mdi-file-image
                </v-icon>
            </v-avatar>
        </template>
    </div>
</template>
<script>
export default {
    name: 'AttachmentDisplay',
    props: [
        'id', 'item', 'column'
    ],
    computed: {
        attachmentArray: function() {
            return this.item[this.id] || [];
        }
    }
}
</script>