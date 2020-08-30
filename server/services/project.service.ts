const { getSQLPool } = require('../sql');

import ProjectSpecification from '../specifications/specification.project';
import projectQueries from '../queries/query.projects';
import Project from "../models/project"


export default class ProjectService {
    constructor() {
    }

    async getProjects(spec: ProjectSpecification) : Promise<Project[]> {
        const pool = await getSQLPool;
        const projects = await projectQueries.getProjects(pool, spec);
        return projects.recordset.map( x => this.ToModel(x) );
    }

    async getProjectById(id: Number) : Promise<Project> {
        const pool = await getSQLPool;
        const project = await projectQueries.getProjectById(pool, id);
        const firstProject= project.recordset[0];
        return this.ToModel(firstProject);
    }

    ToModel(data : any) : Project {
        return Project.fromData(data);
    }
}