export default class ProjectFilter {
    param: string;
    value: any;
    joinStatement: string;
    whereStatement: string;

    constructor(
        index: Number,
        _param: string,
        _fieldid: string,
        _value: any
    ) {
        this.param = "param_" + _param;
        this.value = _value
        this.joinStatement = `
            INNER JOIN field_data fd_${index} ON p.id = fd_${index}.project_id 
        `;
        this.whereStatement = `
            AND fd_${index}.field_id = ${_fieldid} AND fd_${index}.value LIKE '%' + @${this.param } + '%'
        `;
    }
    
}