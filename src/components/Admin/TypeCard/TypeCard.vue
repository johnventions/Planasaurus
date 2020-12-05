<template>
    <div class="list-type list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ obj.name }}</h5>
            <small>{{ obj.qty }} records</small>
        </div>
        <div class="list-type-buttons">
            <router-link :to="`/dash/${obj.codename}`">
                <button class="btn btn-primary">
                    <font-awesome-icon icon="location-arrow" size="1x" />
                    &nbsp; View
                </button>
            </router-link>
            <router-link :to="`/dash/${obj.codename}/layout`">
                <button class="btn btn-primary">
                    <font-awesome-icon icon="edit" size="1x" />
                    &nbsp; Edit Layout
                </button>
            </router-link>
            <button class="btn btn-primary float-right"
                @click="$emit('edit', obj.id)"
                title="Edit Settings">
                    <font-awesome-icon icon="cog" size="1x" />
            </button>
        </div>
        <br/>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: ['obj'],
}
</script>
<style lang="scss">
    .list-type-buttons {
        button {
            margin-right: 5px;
        }
    }
</style>