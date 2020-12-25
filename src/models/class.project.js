
export default class Project {
    id = 0;
    name = '';
    project_type = 0;
    status = '';
    fields = [];
    constructor(type) {
        this.project_type = type;
    }
}