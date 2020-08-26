
import { v4 as uuidv4 } from 'uuid';

export default class FieldComponent {
    constructor(obj = {}) {
        obj && Object.assign(this, obj);
        this.id = obj.id || uuidv4(); 
    }
}