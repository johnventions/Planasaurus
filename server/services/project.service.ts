const { getSQLPool } = require('../sql');

import ProjectSpecification from '../specifications/specification.project';
import projectQueries from '../queries/query.projects';

import FieldUpdate from "../models/fieldUpdate";
import Project from "../models/project";


export default class ProjectService {
    constructor() {
    }

    async createProject(p: Project) : Promise<Project> {
        const pool = await getSQLPool;
        const newProjectId = await projectQueries.newProject(pool, p);
        p.id = newProjectId.recordset[0].id;
        return p;
    }

    async getProjectCount(type: Number) : Promise<Number> {
        const pool = await getSQLPool;
        const count = await projectQueries.getProjectCount(pool, type);
        return parseInt(count.recordset[0].total);
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

    async updateProjectFields(id: Number, fields: Array<any>) : Promise<any> {
        const pool = await getSQLPool;
        // convert fields to proper type
        let fieldData : Array<FieldUpdate> = fields.map(x => {
            return FieldUpdate.fromData(x);
        });
        const update = await projectQueries.updateProject(pool, id, fieldData);
        return 1;
    }

    ToModel(data : any) : Project {
        return Project.fromData(data);
    }
}