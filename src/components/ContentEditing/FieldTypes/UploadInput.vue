<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <div class="input-container" v-if="maxQty == 0 || maxQty > value.length">
            <v-row class="mb-3">
                <v-file-input
                    v-model="files"
                    ref="fileInput"
                    counter
                    :label="field.name">
                ></v-file-input>
                <v-btn 
                    dark
                    v-if="files"
                    color="primary"
                    class="ml-2 mt-3"
                    @click="uploadFile">
                    <span class="d-none d-md-block">
                        Upload
                    </span>
                    <v-icon class="d-block d-md-none">
                        mdi-cloud-upload-outline
                    </v-icon>
                </v-btn>
            </v-row>
        </div>
        <div v-if="value && value.length" v-bind:class="`uploads-${displayType}`">
            <v-list>
                <v-list-item v-for="(file, i) in value" :key="file.uuid">
                    <a target="_blank" :href="file.publicPath">
                        <v-list-item-avatar v-if="file.previewPath">
                            <img v-bind:src="file.previewPath">
                        </v-list-item-avatar>
                        <v-list-item-icon v-else>
                            <v-icon color="indigo">
                                mdi-file
                            </v-icon>
                        </v-list-item-icon>
                    </a>
                    <div class="file-details">
                        {{ file.original_filename }} - <a target="_blank" :href="file.publicPath">View</a>
                        <br/>
                        <button
                            v-on:click="removeElement(file, i)">
                            Remove
                        </button>
                    </div>
                </v-list-item>
            </v-list>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'UploadInput',
    props: [
        'field'
    ],
    data: function() {
        return {
            files: [],
            value: this.$store.getters.getFieldFiles(this.field.id),
            touched: false,
            changes: [],
            fileSelected: false,
        }
    },
    watch: {
        viewMode: function() {
            this.resetValue();
        }
    },
    computed: {
        ... mapState({
            viewMode: state => state.viewMode,
        }),
        maxQty: function() {
            const meta = this.field.metadata || {};
            if (meta.itemQty == null || meta.itemQty == "") return 1;
            return Number.isNaN(parseInt(meta.itemQty)) ? 1 : parseInt(meta.itemQty);
        },
        displayType: function() {
            const meta = this.field.metadata || {};
            const validOptions = ['list', 'thumbnail'];
            if (validOptions.indexOf(meta.display) > -1) return meta.display;
            return 'list';
        }
    },
    methods: {
        ...mapMutations({
           updateField: 'UPDATE_FIELD'
        }),
        handleUpdate(){
            this.updateField({
                id: this.field.id,
                value: this.changes
            });
            this.touched = true;
        },
        uploadFile: function() {
            const formData = new FormData();
            formData.append('attachment', this.files);
            this.$http.post('/upload', formData, {
                headers: {
                     'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.value = [
                        ... this.value,
                        res.data.file
                    ];
                    // add as a pending change
                    this.changes = [
                        ...this.changes,
                        {
                            value: res.data.file.id,
                            order: this.value.length
                        }
                    ];
                this.handleUpdate();
                this.files = null;
            })
        },
        removeElement: function(file, i) {
            // remove from list of projects
            this.$delete(this.value, i);
            this.changes = [
                ...this.changes.filter(x => x.value != file.id),
                {
                    value: file.id * -1
                }
            ];
            this.handleUpdate();
        },
        resetValue() {
            this.value = this.$store.getters.getFieldFiles(this.field.id);
        }
    },
    mounted: function() {
        this.$store.subscribe((mutation) => {
            if (mutation.type == "SET_RECORD") {
                this.resetValue();
            }
        });
    }
}
</script>
<style lang="scss" scoped>
</style>