const { getSQLPool } = require('../sql');

import ProjectSpecification from '../specifications/specification.project';
import projectQueries from '../queries/query.projects';

import FieldUpdate from "../models/fieldUpdate";
import Project from "../models/project";
import TypeService from './types.service';
import FieldDef from '../models/fielddef';


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

    async getProjectType(id: Number) : Promise<Number> {
        const pool = await getSQLPool;
        const project = await projectQueries.getProjectType(pool, id);
        return project.recordset[0].project_type;
    }

    async getProjectFieldDefinitions(id: Number): Promise<Map<string, FieldDef>> {
        const type = await this.getProjectType(id);
        const service = new TypeService();
        const fields = await service.getTypeFieldsMapById(type);
        return fields;
    }

    async updateProjectFields(id: Number, fields: Array<any>) : Promise<any> {
        const pool = await getSQLPool;
        // convert fields to proper type
        let fieldData : Array<FieldUpdate> = fields.map(x => {
            return FieldUpdate.fromData(x);
        });
        const defs = await this.getProjectFieldDefinitions(id);
        const update = await projectQueries.updateProject(pool, id, fieldData, defs);
        return 1;
    }

    async getProjectChildren(id: Number) {
        const pool = await getSQLPool;
        const children = await projectQueries.getProjectChildData(pool, id);
        children.recordset.forEach(x => {
            // let jsonArray = JSON.parse(x.child_meta);
            x.child_meta = JSON.parse(x.child_meta);
            // jsonArray.reduce((obj: any, item: any) => {
            //     obj[item.field_id] = item;
            //     return obj;
            // }, {});
        });
        return children.recordset;
    }

    ToModel(data : any) : Project {
        return Project.fromData(data);
    }
}