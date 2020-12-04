export default class FieldDef {
    id: Number = 0;
    name: string = '';
    data_type: Number = 1;
    relationship_type: Number | null = null;
    metadata: any = {};

    static fromData(data: any) : FieldDef {
        let d = new FieldDef();
        d.id = data.id;
        d.name = data.name;
        d.data_type = data.data_type;
        d.relationship_type = data.relationship_type;

        return d;
    }
}