<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <button disabled>
            Yes
        </button>
        <button disabled>
            No
        </button>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>