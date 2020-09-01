import { v4 as uuidv4 } from 'uuid';
import FieldComponent from "@/models/class.fieldcomponent";

export default class Zone {
    id = 0;
    components = [];

    constructor(obj = {}) {
        this.id = obj ? obj.id || uuidv4() : uuidv4();
        if (obj == null) return;
        if (obj && obj.components) {
            this.components = obj.components.map( x => {
                return new FieldComponent(x);
            });
        }
    }
}