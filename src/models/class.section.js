import { v4 as uuidv4 } from 'uuid';
import Zone from "@/models/class.zone";
export default class Section {
    style = "full";
    zones = [new Zone()];

    constructor(obj = {}) {
        this.id = obj.id || uuidv4();
        this.style = obj.style || "full";
        if (obj && obj.zones) {
            this.zones = obj.zones.map( x => {
                return new Zone(x || {});
            })
        }
    }

    static create(type) {
        let s =  new this();
        s.style = type || "full";
        if (s.style !== "full") {
            s.zones = [new Zone(), new Zone()];
            if (s.style == "33-33-33") {
                s.zones.push(new Zone());
            }
        }
        return s;
    }
}