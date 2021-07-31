import * as sql from 'mssql';
import ProjectFilter from './projectFilter';

export default class ProjectQuery {
    request: sql.Request;
    joins: string[] = [];
    wheres: string[] = [];
    constructor(req: sql.Request, projectType: number) {
        this.request = req;
        this.request.input('ptype', sql.Int, projectType);
        this.request.multiple = true;
    }

    public expandFilters(filters: ProjectFilter[]) {
        filters.forEach(
            x => {
                const [ joins, wheres ] = x.process(this.request);
                this.joins.push(joins);
                this.wheres.push(wheres);
            }
        );
    }

    public joinString() {
        return this.joins.join(" ");
    }

    public whereString() {
        return this.wheres.join(" ");
    }
}