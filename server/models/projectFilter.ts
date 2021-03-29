import * as sql from 'mssql';

import tableMap from "../data/tableMap";
import FieldDef from "./fielddef";

export default class ProjectFilter {
    param: string;
    fieldID: Number;
    value: any;
    index: Number;
    operator: string = "=";
    joinStatement: string = '';
    whereStatement: string = '';
    def: FieldDef;

    constructor(
        i: Number,
        _param: string,
        _fieldid: string | Number,
        _value: any,
        def?: FieldDef
    ) {
        this.index = i;
        this.param = "param_" + _param;
        this.fieldID = typeof _fieldid == "string" ? parseInt(_fieldid) : _fieldid;
        this.value = _value
        this.def = def || new FieldDef();
    }

    process(request: sql.Request) : any {
        let table_name = "field_dates";
        if (this.def) {
            table_name = tableMap(this.def.data_type);
        } else {
            return ['', '']; // bail if no field definition
        }

        if (this.def.data_type == 7) {
            /* data_type 3 == Related Data */
            this.generateRelatedStatements(request, table_name);
        } else {
            this.generateBasicStatements(request, table_name);
        }
        return [ this.joinStatement, this.whereStatement ];
    }

    generateBasicStatements(request: sql.Request, table_name: string) {
        if (this.def == null) return;
        const dataTable = `fd_${this.index}`;
        let op = this.operator;
        let val = this.value;

        this.joinStatement = `
            INNER JOIN ${table_name} ${dataTable} ON p.id = ${dataTable}.project_id 
        `;

        if (this.def.data_type == 3) {
            /* data_type 3 == Date */
            this.makeDateComparisonWhere(request, dataTable, this.fieldID, this.param, this.value);
        } else if (this.def.data_type == 4) {
            this.makeBoolComparison(request, dataTable, this.fieldID, this.param, this.value);
        } else if (this.def.data_type == 6 || this.def.data_type == 5) {
            /* 
                data_type 5 = Dropdwon Static
                data_type 6 == Dropdown related
            */
           this.makeExactIntCompare(request, dataTable, this.fieldID, this.param, this.value);
        } else {
            /*
                data_type 1 = Text
                data_type 2 = Number
                data_type 4 = Toggle
            */
           this.makeLikeComparision(request, dataTable, this.fieldID, this.param, this.value);
        }
    }

    generateRelatedStatements(request: sql.Request, table_name: string) {
        if (this.def == null) return;

        const relatedAlias = `fr_${this.fieldID}`;
        this.joinStatement = `
            INNER JOIN field_related ${relatedAlias} ON p.id = ${relatedAlias}.project_id
        `;
        this.whereStatement = `
            AND ${relatedAlias}.field_id = ${this.fieldID}
        `;

        // create joins for all of the related data
        Object.keys(this.value).forEach((key: any) => {
            const tableAlias = `fd_${this.fieldID}_${key}`;
            const childParam = `${this.param}_${key}`;
            const childDef = this.def.related_fields.get(key);

            const sourceTable = tableMap(childDef ? childDef.data_type : 0);

            this.joinStatement += `
                INNER JOIN ${sourceTable} ${tableAlias} ON ${tableAlias}.project_id = ${relatedAlias}.value
            `;
            // TODO: use the correct format based on the data type of the child field
            if (!childDef) return;
            if (childDef.data_type == 1) { // Text
                this.makeLikeComparision(request, tableAlias, key, childParam, this.value[key]);
            } else if (childDef.data_type == 4) {
                this.makeBoolComparison(request, tableAlias, key, childParam, this.value[key]);
            } else if (childDef.data_type == 6 || childDef.data_type == 5) {
                /* 
                    data_type 5 = Dropdwon Static
                    data_type 6 == Dropdown related
                */
                this.makeExactIntCompare(request, tableAlias, key, childParam, this.value[key]);
            } else if (childDef.data_type == 3) {
                /* data_type 3 == Date */
                this.makeDateComparisonWhere(request, tableAlias, key, childParam, this.value[key]);
            }
        });        
    }

    
    makeDateComparisonWhere(request: sql.Request, tableAlias: string, fieldID: Number, param: string, value: string) {
        let [val, op] = this.checkOperator(value);
        this.whereStatement += `
            AND ${tableAlias}.field_id = ${fieldID} AND ${tableAlias}.value ${op} @${param}
        `;
        request.input(param, `${ val }`);
    }

    makeBoolComparison(request: sql.Request, tableAlias: string, fieldID: Number, param: string, value: string) {
        this.whereStatement = `
            AND ${tableAlias}.field_id = ${fieldID} AND ${tableAlias}.value = @${param}
        `;
        request.input(param, `${ value == 'true'  ? 1 : 0 }`);
    }
    

    makeExactIntCompare(request: sql.Request, tableAlias: string, fieldID: Number, param: string, value: string) {
        this.whereStatement = `
            AND ${tableAlias}.field_id = ${fieldID} AND ${tableAlias}.value = @${param}
        `;
        request.input(param, `${ value }`);
    }
    
    makeLikeComparision(request: sql.Request, tableAlias: string, fieldID: Number, param: string, value: string)  {
        this.whereStatement = `
            AND ${tableAlias}.field_id = ${fieldID} AND ${tableAlias}.value LIKE '%' + @${param} + '%'
        `;
        request.input(param, `${ value }`);
    }


    checkOperator(value: string) {
        let v = value;
        let o = '=';
        const initial = value.charAt(0);
        if ([">", "<", "="].includes(initial)) {
            v = value.substring(1);
            o = initial;
        }
        return [v, o];
    }

    populateParameters(request: sql.Request) {
        if (this.def && this.def.data_type == 7) {
            return;
        }
    }
    
}