<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <select class="form-control">
            <option disabled selected>Select One</option>
        </select>
    </div>
</template>
<script>
export default {
    props: [
        'field'
    ]
}
</script>