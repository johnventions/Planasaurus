const { getSQLPool } = require('../sql');
import typeQueries from '../queries/query.types';

import ProjectType from "../models/projecttype";
import FieldDef from "../models/fielddef";
import Layout from "../models/layout";

export default class TypeService {
    constructor() {
    }

    async getTypes(workspace: number) : Promise<ProjectType[]> {
        const pool = await getSQLPool;
        const types = await typeQueries.getProjectTypes(pool, workspace);
        return types.recordset.map(x => this.ToTypeModel(x) );
    }

    async createOrUpdateType(workspace: number, type: ProjectType) : Promise<ProjectType> {
        const pool = await getSQLPool;
        if (type.id == 0) {
            const ins = await typeQueries.createType(pool, workspace, type);
            type.id = ins.recordset[0].id;
        } else {
            await typeQueries.updateType(pool, workspace, type)
        }
        return type;;
    }

    async getTypeById() {

    }

    async getTypeFieldsById(id: number): Promise<FieldDef[]>{
        const pool = await getSQLPool;
        const fields = await typeQueries.getFieldsByType(pool, id);
        return fields.recordset.map(x => this.ToFieldModel(x));

    }

    async getTypeFieldsMapById(id: number): Promise<Map<string, FieldDef>> {
        const fields = await this.getTypeFieldsById(id);
        let fieldMap = new Map<string, FieldDef>();
        fields.filter(f => f.parent == null).forEach(x => {
            const fieldPut = x;

            let related_fields = new Map<string, FieldDef>();
            if (x.data_type == 7) {
                // get child fields
                fields.filter(c => c.parent == x.id).forEach( r => {
                    related_fields.set(r.id.toString(), r);
                });
                fieldPut.related_fields = related_fields;
            }

            fieldMap.set(x.id.toString(), fieldPut); 
        });
        return fieldMap;

    }

    async createTypeField(typeID: number, field: FieldDef): Promise<FieldDef> {
        const pool = await getSQLPool;
        const result = await typeQueries.createFieldForType(pool, typeID, field);
        let created = result.recordset[0];
        let f: FieldDef = { ...field, id: created.id};
        return f;
    }

    async updateTypeField(fieldID: number, field: FieldDef): Promise<FieldDef> {
        const pool = await getSQLPool;
        const result = await typeQueries.updateFieldDefinition(pool, fieldID, field);
        let f: FieldDef = { ...field };
        return f;
    }

    ToTypeModel(data: any) : ProjectType {
        return ProjectType.fromData(data);
    }

    ToFieldModel(data: any) : FieldDef {
        return FieldDef.fromData(data);
    }

    async getTypeLayoutById(typeID: number): Promise<Layout> {
        const pool = await getSQLPool;
        const result = await typeQueries.getLayoutForProjectType(pool, typeID);
        let layout: Layout = Layout.fromData(JSON.parse(result.recordset[0].layout));
        return layout;
    }

    async getTypeOptionsById(typeID: number): Promise<any> {
        const pool = await getSQLPool;
        const result = await typeQueries.getOptionsForProjectType(pool, typeID);
        let options : any = {};
        result.recordset.forEach(v => {
            options[v.field_id] = JSON.parse(v.options);
        });
        return options;
    }

    async updateTypeLayoutById(typeID: number, layout: any): Promise<any> {
        const pool = await getSQLPool;
        const result = await typeQueries.updateLayoutForProjectType(pool, typeID, JSON.stringify(layout));
        return result;
    }

    async updateTypeFieldLayoutById(typeID: number, layout: any): Promise<any> {
        const pool = await getSQLPool;
        const result = await typeQueries.updateFieldLayoutForProjectType(pool, typeID, JSON.stringify(layout));
        return result;
    }
}
