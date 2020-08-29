export default class FieldEntry {
    id: Number = 0;
    field_id: Number = 0;
    key: String = '';
    value: any;

    static fromData(data: string): Array<FieldEntry> {
        let arr = JSON.parse(data);
        console.log(arr);
        return arr as Array<FieldEntry>;
    }
}