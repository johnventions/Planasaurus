
export default class Project {
    id = 0;
    name = '';
    project_type = 0;
    status = '';
    date_created = Date.now();
    fields = [];
    constructor(type) {
        console.log(type);
        this.project_type = type;
    }
}