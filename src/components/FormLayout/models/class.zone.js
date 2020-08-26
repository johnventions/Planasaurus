import { v4 as uuidv4 } from 'uuid';
import FieldComponent from "./class.fieldcomponent";

export default class Zone {
    constructor(obj = {}) {
        this.id = obj.id || uuidv4();
        if (obj && obj.components) {
            this.components = obj.components.map( x => {
                return new FieldComponent(x);
            })
        }
    }
}