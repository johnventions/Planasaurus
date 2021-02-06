import * as sql from 'mssql';
import FieldDef from "../models/fielddef";
import ProjectType from "../models/projecttype";


const getProjectTypes = function (pool: sql.ConnectionPool, workspace: Number) {
    const select = `
    /* SELECT THE LIST OF PROJECT TYPES */
        SELECT
            t.id,
            t.name,
            t.codename,
            t.parent_id,
            t.menu_order,
            p.qty
        FROM project_types t
        INNER JOIN workspaces w ON t.workspace = w.id
        LEFT JOIN (
            SELECT
                project_type, 
                COUNT(id) as qty
            FROM projects 
            GROUP BY project_type
            ) p ON t.id = p.project_type
        WHERE w.id = @workspace
        ORDER BY parent_id, menu_order
`;
    const request = pool.request();
    request.input('workspace', sql.Int, workspace);
    return request.query(select);
}

const createType = function (pool: sql.ConnectionPool, workspace: Number, type: ProjectType) {
    const insert = `
        INSERT INTO project_types 
            (name, codename, parent_id, workspace, menu_order)
        VALUES
            (@n, @c, @p, @w, @m);
        SELECT SCOPE_IDENTITY() as id;
    `;

    const request = pool.request();
    request.input('n', sql.VarChar, type.name);
    request.input('c', sql.VarChar, type.codename);
    request.input('p', sql.Int, type.parent_id);
    request.input('w', sql.Int, workspace);
    request.input('m', sql.Int, type.menu_order);
    request.multiple = true;
    return request.query(insert);
}

const updateType = function (pool: sql.ConnectionPool, workspace: Number, type: ProjectType) {
    const update = `
        UPDATE t
        
        SET
            t.name = @n,
            t.codename = @c,
            t.parent_id = @p,
            t.menu_order = @m
        FROM
            project_types t
            INNER JOIN workspaces w ON t.workspace = w.id
        WHERE
            t.id = @id
            AND w.id = @w
    `;

    const request = pool.request();
    request.input('id', sql.Int, type.id);
    request.input('n', sql.VarChar, type.name);
    request.input('c', sql.VarChar, type.codename);
    request.input('p', sql.Int, type.parent_id);
    request.input('m', sql.Int, type.menu_order);
    request.input('w', sql.Int, workspace);
    request.multiple = true;
    return request.query(update);
}

const getFieldsByType = function(pool: sql.ConnectionPool, id: Number) {
    const select = `
    /* SELECT THE LIST OF FIELDS FOR A TYPE TYPES */
        SELECT
            fd.id,
            fd.name,
            fd.data_type,
            fd.relationship_type,
            fd.metadata,
            fd.related_keys,
            null as parent
        FROM field_defs fd
        WHERE fd.project_type = @id
    /* SELECT ONE-DEGREE FIELDS FOR RELATED TYPES */
        UNION 
        SELECT 
            fd2.id,
            fd2.name,
            fd2.data_type,
            fd2.relationship_type,
            fd2.metadata,
            fd2.related_keys,
            fdr.id as parent
        FROM field_defs fdr
        INNER JOIN field_defs fd2 ON fd2.project_type = fdr.relationship_type
        WHERE fdr.project_type = @id AND fdr.data_type = 7
`;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.multiple = true;
    return request.query(select);
}


const createFieldForType = function (pool: sql.ConnectionPool, typeID: Number, field: FieldDef) {
    const insert = `
    /* CREATE A NEW RECORD IN field_defs */
        INSERT INTO field_defs
            (project_type, name, data_type)
        VALUES
            (@pt, @name, @dt);
        SELECT SCOPE_IDENTITY() as id;
`;

    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.input('name', sql.VarChar, field.name);
    request.input('dt', sql.Int, field.data_type);
    request.multiple = true;
    return request.query(insert);
}

const updateFieldDefinition = function (pool: sql.ConnectionPool, fieldID: Number, field: FieldDef) {
    const update = `
    /* UPDATE EXISTING NEW RECORD IN field_defs */
        UPDATE field_defs
        SET name = @fieldName,
            metadata = @meta,
            relationship_type = @reltype,
            related_keys = @keys
        WHERE id = @id;
`;

    const request = pool.request();
    request.input('fieldName', sql.VarChar, field.name);
    request.input('meta', sql.VarChar, JSON.stringify(field.metadata));
    request.input('id', sql.Int, fieldID);
    request.input('reltype', sql.Int, field.relationship_type);
    request.input('keys', sql.Int, field.related_keys);
    request.multiple = true;
    return request.query(update);

}

const getLayoutForProjectType = function (pool: sql.ConnectionPool, typeID: Number) {
    const select = `
    /* Pull out the LAYOUT field */
        SELECT layout
        FROM project_types
        WHERE id = @pt 
    `;

    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.multiple = true;
    return request.query(select);
}

const getOptionsForProjectType = function (pool: sql.ConnectionPool, typeID: Number) {
    const select = `
    /* Pull out the OPTIONS field */
        SELECT
            defs.id as 'field_id',
            t.codename,
            (
                SELECT 
                    p.id as 'project_id',
                    (
                        SELECT
                            d.field_id,
                            d.value
                        FROM field_data d
                        WHERE 
                            d.field_id IN (defs.related_keys)
                            AND d.project_id = p.id
                        FOR JSON AUTO
                    ) as meta
                FROM projects p
                WHERE p.project_type = defs.relationship_type
                ORDER BY p.id ASC
                FOR JSON AUTO

            ) as options 
        FROM project_types t
        INNER JOIN field_defs defs ON t.id = defs.project_type
        WHERE t.id = @pt
        AND defs.data_type IN(6, 7);
    `;
    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.multiple = true;
    return request.query(select);
}

const updateLayoutForProjectType = function (pool: sql.ConnectionPool, typeID: Number, layout: String) {
    const update = `
        UPDATE project_types
        SET layout = @layout
        WHERE id = @pt;
`;

    const request = pool.request();
    request.input('pt', sql.Int, typeID);
    request.input('layout', sql.VarChar, layout);
    request.multiple = true;
    return request.query(update);
}

const _ = {
    getProjectTypes,
    createType,
    updateType,
    getFieldsByType,
    createFieldForType,
    getLayoutForProjectType,
    getOptionsForProjectType,
    updateLayoutForProjectType,
    updateFieldDefinition
}

export default _;