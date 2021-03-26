<template>
    <div>
        <v-card-title class="px-0">Dropdown Options</v-card-title>
        <v-container>
            <v-row>
                <v-text-field label="New Option" v-model="inputValue"/>
                <v-btn color="primary" class="mt-3 ml-2" @click="addOption">
                    Add Option
                </v-btn>
            </v-row>
        </v-container>
        <v-list>
            <v-list-item dense v-for="(item, i) in value" :key="i">
                <v-list-item-content>
                    {{ item }}
                </v-list-item-content>
                <v-list-item-action dense>
                    <v-btn icon>
                        <v-icon dense 
                            @click="removeOption(i)"
                            color="red lighten-1">
                            mdi-trash-can
                        </v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </div>
</template>
<script>
export default {
    props: ['field'],
    data: function() {
        return {
            inputValue: '',
            value: [],
        };
    },
    methods: {
        handleNameUpdate: function(){
            this.$emit('updateFieldMeta', 'options', this.value);
        },
        addOption: function() {
            if (this.inputValue == '') return;
            this.value = [ ...this.value, this.inputValue];
            this.handleNameUpdate();
            this.inputValue = '';
        },
        removeOption: function(i) {
            const options = [ ... this.value ];
            options.splice(i, 1);
            this.value = options;
        }
    },
    mounted: function() {
        if (this.field.metadata) {
            this.value = this.field.metadata.options || [];
        } else {
            this.value = [];
        }
    }

}
</script>
<style lang="scss">
    .dropdown-options {
        padding-left: 0px;
        li {
            list-style: none;
            padding: 5px;
            &:nth-child(odd) {
                background: #d4d9da;
            }
        }
    }
</style>