const { getSQLPool } = require('../sql');
import typeQueries from '../queries/query.types';

import ProjectType from "../models/projecttype";
import FieldDef from "../models/fielddef";

export default class TypeService {
    constructor() {
    }

    async getTypes() : Promise<ProjectType[]> {
        const pool = await getSQLPool;
        const types = await typeQueries.getProjectTypes(pool);
        return types.recordset.map(x => this.ToTypeModel(x) );
    }

    async getTypeById() {

    }

    async getTypeFieldsById(id: Number): Promise<FieldDef[]>{
        const pool = await getSQLPool;
        const fields = await typeQueries.getFieldsByType(pool, id);
        return fields.recordset.map(x => this.ToFieldModel(x));

    }

    async createTypeField(projectID: Number, field: FieldDef): Promise<FieldDef> {
        const pool = await getSQLPool;
        const result = await typeQueries.createFieldForType(pool, projectID, field);
        let created = result.recordset[0];
        let f: FieldDef = { ...field, id: created.id};
        return f;
    }

    ToTypeModel(data: any) : ProjectType {
        return ProjectType.fromData(data);
    }

    ToFieldModel(data: any) : FieldDef {
        return FieldDef.fromData(data);
    }
}
