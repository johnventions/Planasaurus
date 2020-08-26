import Section from "./class.section";

export default class Area {
    constructor(obj) {
        if (obj && obj.sections) {
            this.sections = obj.sections.map( x => {
                return new Section(x);
            });
        }
    }
}