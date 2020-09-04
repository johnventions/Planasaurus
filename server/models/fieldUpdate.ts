import { v4 } from "uuid";

class FieldUpdate {
    paramID: String;
    field_id: Number = 0;
    value: String = '';

    constructor(field_id: Number, value: String) {
        this.paramID = v4().replace(/-/g, '');
        this.field_id = field_id;
        this.value = value;
    }

    static fromData(data: any) : FieldUpdate {
        return new FieldUpdate(data.field_id, data.value);
    }

    toUpdateString() {
        return `
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
	BEGIN TRANSACTION;
    UPDATE [field_data]
        SET value = @${ this.paramID }_v
        WHERE field_id = @${ this.paramID }_f AND project_id = @id
	IF @@ROWCOUNT = 0
	BEGIN
      INSERT INTO field_data
        (field_id, project_id, value)
	  VALUES (@${ this.paramID }_f, @id, @${ this.paramID }_v)
	END
COMMIT TRANSACTION;
        `
    }


}

export default FieldUpdate;