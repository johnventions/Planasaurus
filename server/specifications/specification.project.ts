import {  Options, OptionsJson } from 'body-parser';
import { stringify } from 'querystring';

export default class ProjectSpecification {
    type: Number;
    sortBy: String;
    sortByDir?: String;
    fields: Map<string, any>;

    static ignoreFields : string[] = [
        'type',
        'sortBy',
        'xortByDir'
    ];

    constructor(
        _type: Number,
        _sortBy: string | null,
        _sortByDir: string | null
    ) {
        this.type = _type;
        this.sortBy = _sortBy || 'ID';
        this.sortByDir = _sortByDir ||  'DESC';
        this.fields = new Map<string, any>();
    }

    public static fromParams(qs: any) {
        let proj: ProjectSpecification = new this(
            qs.type,
            qs.sortBy,
            qs.sortByDir
        );
        for (const [key, value] of Object.entries(qs)) {
            proj.fields.set(key, value);
        }
        return proj;
    }
}