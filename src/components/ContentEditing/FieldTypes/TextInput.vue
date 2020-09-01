<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <input type="text" class="form-control"/>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>