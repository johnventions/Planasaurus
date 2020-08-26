import { v4 as uuidv4 } from 'uuid';

import Section from "./class.section";

export default class Area {
    constructor(obj = {}) {
        this.id = obj.id || uuidv4();
        if (obj && obj.sections) {
            this.sections = obj.sections.map( x => {
                return new Section(x);
            });
        }
    }
}