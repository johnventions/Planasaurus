<template>
    <div class="form-group">
        <label>{{ field.name }}</label><br/>
        <select disabled class="form-control">
            <option selected disabled>Select One</option>
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