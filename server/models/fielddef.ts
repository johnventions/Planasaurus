export default class FieldDef {
    id: number = 0;
    name: string = '';
    data_type: number = 1;
    relationship_type: number | null = null;
    metadata: any = {};
    related_keys: number | null = null;
    parent: number | null = null;
    related_fields: Map<string, FieldDef> = new Map<string, FieldDef>();

    static fromData(data: any) : FieldDef {
        let d = new FieldDef();
        d.id = data.id;
        d.name = data.name;
        d.data_type = data.data_type;
        d.relationship_type = data.relationship_type;
        d.related_keys = data.related_keys ? parseInt(data.related_keys) : null;
        d.parent = data.parent ? parseInt(data.parent) : null;
        if (data.metadata != null) {
            if (typeof data.metadata == "string") {
                try {
                    d.metadata = JSON.parse(data.metadata);
                } catch {
                    d.metadata = {};
                }
            } else if (typeof data.metadata == "object") {
                d.metadata = data.metadata;
            }
        }
        return d;
    }
}