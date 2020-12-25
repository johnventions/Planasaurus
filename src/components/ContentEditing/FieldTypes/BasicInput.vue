<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <label>{{ field.name }}</label><br/>
        <div class="input-container">
            <input :type="type" 
                class="form-control"
                v-bind:class="{touched: touched}"
                v-on:change="handleUpdate"
                v-on:keyup="handleUpdate"
                v-on:keyup.enter="handleSubmit"
                v-model="value"/>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
    props: [
        'field', 'type'
    ],
    data: function() {
        return {
            value: this.$store.getters.getFieldVal(this.field.id),
            touched: false,
        }
    },
    watch: {
        viewMode: function() {
            this.resetValue();
        },
        $route() {
            this.resetValue();
        },
    },
    computed: {
        ... mapState({
            viewMode: state => state.viewMode,
        })
    },
    methods: {
        ...mapMutations({
           updateField: 'UPDATE_FIELD'
        }),
        ...mapActions([
            'searchProjectRecords',
            'saveLatestLayout'
        ]),
        handleUpdate(){
            this.updateField({
                id: this.field.id,
                value: this.value
            });
            this.touched = true;
        },
        handleSubmit() {
            if (this.viewMode == 'find') {
                this.searchProjectRecords();
            }
        },
        resetValue() {
            this.value = this.$store.getters.getFieldVal(this.field.id);
            this.touched = false;
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
            input, select {
                    background-color: #d9f6ff;
                }
        }

        input {
            &.touched {
                border: 2px solid #328d32;
                font-weight: bold;
            }
        }
    }
</style>