<template>
    <div class="form-group"
        v-bind:class="{ find: viewMode == 'find' }"
    >
        <label>{{ field.name }}</label><br/>
        <div class="input-container">
            <input :type="type" 
                class="form-control"
                v-on:change="handleUpdate"
                v-model="value"/>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
    props: [
        'field', 'type'
    ],
    data: function() {
        return {
            value: this.$store.getters.getFieldVal(this.field.id)
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
        })
    },
    methods: {
        ...mapMutations({
           updateField: 'UPDATE_FIELD'
        }),
        handleUpdate(){
            this.updateField({
                id: this.field.id,
                value: this.value
            });   
        },
        resetValue() {
            this.value = this.$store.getters.getFieldVal(this.field.id);
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
    }
</style>