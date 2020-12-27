import {  Options, OptionsJson } from 'body-parser';
import { stringify } from 'querystring';
import FieldDef from '../models/fielddef';

export default class ProjectSpecification {
    type: Number;
    sortBy: string;
    sortByDir?: string;
    fields: Map<string, any>;
    definitions: Map<string, FieldDef> = new Map < string, FieldDef>();

    static ignoreFields : string[] = [
        'type',
        'sortBy',
        'sortByDir'
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

    public static fromParams(qs: any, fieldDefs: Map<string, FieldDef>) {
        let proj: ProjectSpecification = new this(
            qs.type,
            qs.sortBy,
            qs.sortByDir
        );
        const skipList = ['type', 'sortBy', 'sortByDir'];
        for (const [key, value] of Object.entries(qs)) {
            if (skipList.indexOf(key) == -1) {
                proj.fields.set(key, value);
            }
        }
        if (fieldDefs != null) {
            proj.definitions = fieldDefs;
        }
        return proj;
    }
}