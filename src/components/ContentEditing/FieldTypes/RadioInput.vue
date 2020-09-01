<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <button>
            Yes
        </button>
        <button>
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