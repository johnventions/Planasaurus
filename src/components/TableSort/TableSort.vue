<template>
    <div>
        <table>
            <thead>
                <th v-for="(col, i) in columns" :key="`${i}_${col.name}`">
                    {{ col.label ? col.label : col.name }}
                </th>
            </thead>
            <tbody>
                <tr v-for=" (row, i) in rows" :key="i">
                    <td v-for="(colData, j) in columns" :key="`${j}_${colData.name}`">
                        <template v-if="colData.component">
                            <div 
                            v-bind="row[colData.name]"
                                :is="colData.component"></div>
                        </template>
                        <template v-else>
                            {{ row[colData.name] }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'TableSort',
    props: [
        'columns', 'rows'
    ]
}
</script>
<style lang="scss">
    table {
        width: 100%;
    }
</style>