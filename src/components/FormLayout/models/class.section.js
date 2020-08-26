import { v4 as uuidv4 } from 'uuid';
import Zone from "./class.zone";
export default class Section {
    style = "full";

    constructor(obj = {}) {
        console.log(obj);
        this.id = obj.id || uuidv4();
        this.style = obj.style || "full";
        if (obj && obj.zones) {
            this.zones = obj.zones.map( x => {
                return new Zone(x);
            })
        } else {
            this.zones = [new Zone()];
        }
    }

    static create(type) {
        let s =  new this();
        s.style = type || "full";
        if (s.style !== "full") {
            s.zones = [new Zone(), new Zone()];
        }
        return s;
    }
}