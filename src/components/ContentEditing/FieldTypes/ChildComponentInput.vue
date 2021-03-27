<template>
    <div class="form-group" 
        v-bind:class="{ find: viewMode == 'find' }">
        <v-flex class="mb-3">
            <label class="mr-5">{{ field.name }}</label>
            <v-btn dark
                dense
                color="primary" 
                @click="startAddRecord">
                + Add
            </v-btn>
        </v-flex>

        <v-data-table
            dense
            :headers="headers"
            :items="items">
            <template v-for="col in dynamicColumns"
                v-slot:[`item.${col.value}`]="{ item }">
                <div
                    :isNested="true"
                    :field="col.field"
                    :parentField="field"
                    :is="displayField()"
                    type="text"
                    :item="item"
                     :key="col.value">
                </div>
            </template>
        </v-data-table>

        <v-dialog v-model="addItemModal" max-width="450">
            <v-card>
                <v-card-title>
                    Select item to add!
                </v-card-title>
                <v-card-text>
                    <v-select 
                        v-model="pendingAdd"
                        :items="relatedOptions"
                        item-text="name"
                        item-value="project_id">
                    </v-select>
                    <v-btn 
                        color="primary"
                        @click="finishAddRecord"
                        v-if="pendingAdd">
                        Add Item
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import api from '@/util/api';
import Project from '@/models/class.project';
import BasicInput from '@/components/ContentEditing/FieldTypes/BasicInput.vue';

export default {
    name: 'ChildElementComponent',
    props: [
        'field', 'type'
    ],
    components: {
    },
    data: function() {
        return {
            value: this.$store.getters.getFieldArrayVal(this.field.id),
            changes: [],
            addItemModal: false,
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
        dynamicColumns: function() {
            return this.headers.map(x => {
                if (this.viewMode == 'find') {
                    return x;
                }
                return null;
            }).filter(y => y != null);
        },
        items: function() {
            const cols = this.headers || [];

            if (this.viewMode == 'find') {
                let findRow = {};
                cols.forEach( y => {
                    findRow[y.value] = "ABC";
                });
                return [findRow];
            }

            const list = this.value || [];
            return list.map(x => {
                let obj = {};
                cols.forEach( y => {
                    if (x.fieldsMapped == null) return;
                    let fieldObj = x.fieldsMapped[y.value] || {};
                    obj[y.value] = fieldObj.value;
                });
                return obj;
            });
        },
        childFields: function() {
            return this.value;
        },
        relatedOptions: function() {
            const { id } = this.$store.getters.activeProjectType;
            const activeLayout = this.$store.state.projectLayouts[id];
            if (activeLayout && activeLayout.related[this.field.id]) {
                const related = activeLayout.related[this.field.id];
                return related.map(x => {
                    const display = x.meta && x.meta.length ? x.meta[0].value : x.project_id; 
                    return {
                        ...x,
                        name: display
                    }
                });
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
            this.addItemModal = true;
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
        },
        displayField: function() {
            return BasicInput;
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
</style>