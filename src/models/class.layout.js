import Area from "@/models/class.area";

export default class Layout {
    primaryArea = new Area();
    sidebar = new Area();

    constructor(obj = {}) {
        if (obj.primaryArea) {
            this.primaryArea = new Area(obj.primaryArea);
        }
        if (obj.sidebar) {
            this.sidebar = new Area(obj.sidebar);
        }
    }
}