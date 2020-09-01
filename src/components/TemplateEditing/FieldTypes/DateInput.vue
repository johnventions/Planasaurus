<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <input type="date" disabled class="form-control"/>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>