export default class ProjectFilter {
    param: String;
    value: any;
    joinStatement: String;
    whereStatement: String;

    constructor(
        index: Number,
        _param: String,
        _fieldid: Number,
        _value: any
    ) {
        this.param = _param;
        this.value = _value
        this.joinStatement = `
            INNER JOIN field_data fd_${index} ON p.id = fd_${index}.project_id 
        `;
        this.whereStatement = `
            AND fd_${index}.field_id = ${_fieldid} AND fd_${index}.value = @${_param}
        `;
    }
    
}