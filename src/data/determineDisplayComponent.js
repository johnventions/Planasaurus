import fieldTypes from "@/data/fieldTypes";
import AttachmentDisplay from '@/components/ListDisplay/AttachmentDisplay';


const determineDisplayComponent = (fieldDef) => {
    const fieldType = fieldTypes.find(x => x.id == fieldDef.data_type);
    if (fieldDef.data_type == 8) {
        // attachments
        return AttachmentDisplay;
    }
    if (fieldType && fieldType.isForeignKey) {
        return null;
    }
    return null;
}


export default determineDisplayComponent