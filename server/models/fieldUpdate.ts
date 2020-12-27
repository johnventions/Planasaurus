import { v4 } from "uuid";
import tableMap from "../data/tableMap";
import FieldDef from "./fielddef";

class FieldUpdate {
    paramID: string;
    field_id: Number = 0;
    value: string = '';

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


}

export default FieldUpdate;