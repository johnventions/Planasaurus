<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <div class="input-container" v-if="maxQty == 0 || maxQty > value.length">
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
                @click="uploadFile">
                Upload
            </v-btn>
        </div>
        <div v-if="value && value.length" v-bind:class="`uploads-${displayType}`">
            <div v-for="(file, i) in value" :key="file.uuid" class="file-container">
                <a target="_blank" :href="file.publicPath">
                    <img v-if="file.previewPath" v-bind:src="file.previewPath">
                    <span v-else class="document-icon">
                        <font-awesome-icon icon="file" size="2x" />
                    </span>
                </a>
                <div class="file-details">
                    {{ file.original_filename }} - <a target="_blank" :href="file.publicPath">View</a>
                    <br/>
                    <button
                        v-on:click="removeElement(file, i)">
                        Remove
                    </button>
                </div>
            </div>
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
    .form-group {
        &.find {
            .input-container {
                position: relative;
                &:after {
                    display: block;
                    position: absolute;
                    content: 'X';
                    height: 20px;
                    width: 20px;
                    right: 5px;
                    top: 5px;
                }
            }
            input {
                    background-color: #d9f6ff;
                }
        }
        input {
            margin-bottom: 15px;
        }
        .uploads-list {
            overflow: hidden;
            img {
                max-width: 100px;
            }
            .file-container {
                display: flex;
                margin-bottom: 8px;
                .file-details {
                    padding: 0 5px;
                }

                .document-icon {
                    display: block;
                    border: 1px solid blue;
                    width: 100px;
                    svg {
                        margin: 10px auto;
                        display: block;
                    }
                }
            }
        }
        .uploads-thumbnail {
            position: relative;
            .file-container {
                display: inline-block;
                margin: 5px;
            }
            img {
                width: 150px;
                height: 150px;
                object-fit: contain;
                background: black;
                border: 1px solid black;
                opacity: 0.8;
                transition: opacity ease 0.2s;
                &:hover {
                    opacity: 1;
                }
            }
            .file-details {
                display: none;
            }
        
            .document-icon {
                display: block;
                width: 150px;
                height: 150px;
                border: 1px solid blue;
                svg {
                    margin: 10px 12px;
                }
            }
        }
    }
</style>