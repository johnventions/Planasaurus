import Zone from "./class.zone";

export default class Section {
    style = "full";

    constructor(obj) {
        console.log(obj);
        this.id = obj.id;
        this.style = obj.style || "full";
        if (obj && obj.zones) {
            this.zones = obj.zones.map( x => {
                return new Zone(x);
            })
        }
    }
}