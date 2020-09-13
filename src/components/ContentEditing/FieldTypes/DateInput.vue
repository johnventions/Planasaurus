<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <input type="datetime-local" class="form-control"/>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>