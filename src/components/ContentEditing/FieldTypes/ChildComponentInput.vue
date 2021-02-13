<template>
    <div class="form-group" 
        v-bind:class="{ find: viewMode == 'find' }">
        <label>{{ field.name }}</label>
        <button 
            @click="startAddRecord"
            class="btn btn-primary btn-add float-right">
            + Add
        </button><br/>
        <div class="nested-input" v-if="value && value.length">
            <child-entry v-for="(child, i) in value"
                v-on:remove-me="removeElement(child, i)"
                :entry="child"
                :field="field"
                :fieldmeta="field.metadata"
                :key="child.id">
            </child-entry>
        </div>
        <div v-else>
            No records
        </div>
        <modal :name="addItemModalName" height="auto">
            <label>
                Select item to add
            </label><br/>
            <select v-model="pendingAdd">
                <option v-for="opt in relatedOptions"
                    :value="opt.project_id"
                    :key="opt.project_id">
                    <template v-if="opt.meta">
                        {{ opt.meta[0].value }}
                    </template>
                </option>
            </select>
            <br/>
            <button 
                class="btn btn-primary"
                @click="finishAddRecord"
                v-if="pendingAdd">
                Add Item
            </button>
        </modal>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import api from '@/util/api';
import Project from '@/models/class.project';


import ChildComponentEntry from './ChildComponentEntry';

export default {
    name: 'ChildElementComponent',
    props: [
        'field', 'type'
    ],
    components: {
        'child-entry': ChildComponentEntry
    },
    data: function() {
        return {
            value: this.$store.getters.getFieldArrayVal(this.field.id),
            changes: [],
            touched: false,
            pendingAdd: null,
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
        childFields: function() {
            return this.value;
        },
        addItemModalName: function() {
            return `addModal_${this.field.id}`;
        },
        relatedOptions: function() {
            const { id } = this.$store.state.activeProjectType;
            const activeLayout = this.$store.state.projectLayouts[id];
            if (activeLayout && activeLayout.related[this.field.id]) {
                return activeLayout.related[this.field.id];
            }
            return null;
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
        resetValue: function() {
            this.value = this.$store.getters.getFieldArrayVal(this.field.id);
            this.touched = false;
        },
        startAddRecord: function() {
            this.$modal.show(this.addItemModalName);
        },
        finishAddRecord: async function() { 
            if (this.pendingAdd) {
                const { data } = await api.getProjectById(this.pendingAdd);
                const newest = Project.FromData(data.project);
                if (data && data.project) {
                    // update the component
                    this.value = [
                        ... this.value,
                        newest
                    ];
                    // add as a pending change
                    this.changes = [
                        ...this.changes,
                        {
                            value: this.pendingAdd,
                            order: this.value.length
                        }
                    ];
                    this.handleUpdate();
                }
            }
        },
        removeElement: function(proj, i) {
            // remove from list of projects
            this.$delete(this.value, i);
            this.changes = [
                ...this.changes,
                {
                    value: proj.id * -1
                }
            ];
            this.handleUpdate();
        }
    },
    mounted: function() {
        this.$store.subscribe((mutation) => {
            if (mutation.type == "SET_RECORD") {
                this.resetValue();
            } else if (mutation.type == "RESET_UPDATES") {
                this.touched = false;
            }
        });
    }
}
</script>
<style lang="scss" scoped>
    .btn-add {
        margin-left: 12px;
        padding: 1px 8px;
    }

    .nested-input {
        border: 1px solid black;
        display: table;
        width: 100%;
    }

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
            select {
                    background-color: #d9f6ff;
                }
        }

        select {
            &.touched {
                border: 2px solid #328d32;
                font-weight: bold;
            }
        }
    }
</style>