import fieldTypes from "@/data/fieldTypes";

const determineDisplayComponent = (fieldDef) => {
    const fieldType = fieldTypes.find(x => x.id == fieldDef.data_type);
    if (fieldType && fieldType.isForeignKey) {
        return null;
    }
    return null;
}


export default determineDisplayComponent