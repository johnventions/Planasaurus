import store from '@/store';

const convertListToTable = (list, headers, projectType) => {
    // loop through every item in that activeList
    if (!list) return;
    const formatted = list.map( row => {
        let fieldRows = {};
        headers.forEach( header => {
            const { customField, value, foreignKeyType, relatedKey } = header
            if (!customField) return;
            // loop through the columns and populate the value
            let baseVal = row.getFieldValue(value);
            if (foreignKeyType && baseVal != "") {
                // if a dropdown, look up the values
                baseVal = store.getters.getRelatedFieldVal(projectType.id, value, baseVal, relatedKey);
            }
            if (header.data_type == 8) {
                // image uploads
                const files = row.files || [];
                baseVal = files.filter(f => f.field_id == header.value);
            }
            fieldRows[value] = baseVal;
        });
        return {
            APP_VIEW: {
                id: row.id,
                codename: projectType.codename
            },
            ID: row.id,
            ... fieldRows
        }
    });
    return formatted;
}

export default convertListToTable