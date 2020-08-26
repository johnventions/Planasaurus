import FieldComponent from "./class.fieldcomponent";

export default class Zone {
    constructor(obj) {
        if (obj && obj.components) {
            this.components = obj.components.map( x => {
                return new FieldComponent(x);
            })
        }
    }
}