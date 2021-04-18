<template>
    <div>
        <template v-for="attach in attachmentArray">
            <a :key="attach.id" 
                target="_blank"
                :href="attach.publicPath">
                <v-avatar 
                    :title="attach.filename"
                    class="mr-1"
                    color="secondary">
                    <v-img :src="attach.previewPath"  v-if="attach.previewPath"/>
                    <v-icon v-else dark>
                        mdi-file-image
                    </v-icon>
                </v-avatar>
            </a>
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
            const attachments = this.item[this.id] || [];
            return [ ...attachments ].splice(0, 3);
        }
    }
}
</script>