import fieldTypes from "@/data/fieldTypes";

const determineDisplayComponent = (id) => {
    const fieldType = fieldTypes.find(x => x.id == id);
    if (fieldType && fieldType.isForeignKey) {
        return true;
    }
    return false;
}


export default determineDisplayComponent