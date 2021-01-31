import { v4 } from "uuid";
import tableMap from "../data/tableMap";
import FieldDef from "./fielddef";

class FieldUpdate {
    paramID: string;
    field_id: Number = 0;
    value: any = '';

    constructor(field_id: Number, value: string) {
        this.paramID = v4().replace(/-/g, '');
        this.field_id = field_id;
        this.value = value;
    }

    static fromData(data: any) : FieldUpdate {
        return new FieldUpdate(data.field_id, data.value);
    }

    toUpdateString(fieldID: any, definition?: FieldDef) {
        let table_name = tableMap(definition ? definition.data_type : 0);
        if (table_name == 'field_related' || table_name == 'field_uploads') {
            // related items will send an array of changes, not a string value
            return this.toRelatedUpdateStrings(table_name);
        }
        return `
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
                BEGIN TRANSACTION;
                UPDATE [${table_name}]
                    SET value = @${ this.paramID }_v
                    WHERE field_id = @${ this.paramID }_f AND project_id = @id
                IF @@ROWCOUNT = 0
                BEGIN
                INSERT INTO [${table_name}]
                    (field_id, project_id, value)
                VALUES (@${ this.paramID }_f, @id, @${ this.paramID }_v)
                END
            COMMIT TRANSACTION;
        `
    }

    toRelatedUpdateStrings(table_name: string) {
        let update = '';
        console.log(this.value);
        if (!Array.isArray(this.value)) return '';
        this.value.forEach(x => {
            if (parseInt(x.value) > 0) {
                // if positive, insert
                update += `
                INSERT INTO [${table_name}]
                    (field_id, project_id, value)
                VALUES (@${ this.paramID }_f, @id, ${ parseInt(x.value) })
                `;
            } else {
                // if negative, delete
                update += `
                DELETE FROM [${table_name}]
                WHERE field_id = @${ this.paramID }_f
                AND project_id = @id
                AND value =  ${ parseInt(x.value) * -1 }
                `
            }
        });

        return update;
    }


}

export default FieldUpdate;