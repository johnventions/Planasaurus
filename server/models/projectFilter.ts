import tableMap from "../data/tableMap";
import FieldDef from "./fielddef";

export default class ProjectFilter {
    param: string;
    value: any;
    operator: string = "=";
    joinStatement: string;
    whereStatement: string;
    def?: FieldDef;

    constructor(
        index: Number,
        _param: string,
        _fieldid: string,
        _value: any,
        def?: FieldDef
    ) {
        this.param = "param_" + _param;
        this.value = _value
        this.def = def;
        let table_name = "field_dates";
        if (def) {
            table_name = tableMap(def.data_type);
        }
        if (def && def.data_type == 3) {
            this.checkOperator();
            this.whereStatement = `
                AND fd_${index}.field_id = ${_fieldid} AND fd_${index}.value ${this.operator} @${this.param}
            `;
        } else if (def && def.data_type == 6) {
                this.checkOperator();
                this.whereStatement = `
                AND fd_${index}.field_id = ${_fieldid} AND fd_${index}.value = @${this.param}
            `;
        } else {
            this.whereStatement = `
                AND fd_${index}.field_id = ${_fieldid} AND fd_${index}.value LIKE '%' + @${this.param} + '%'
            `;
        }
        this.joinStatement = `
            INNER JOIN ${table_name} fd_${index} ON p.id = fd_${index}.project_id 
        `;
    }

    checkOperator() {
        const initial = this.value.charAt(0);
        if ([">", "<"].includes(initial)) {
            this.value = this.value.substring(1);
            this.operator = initial;
        }
    }
    
}