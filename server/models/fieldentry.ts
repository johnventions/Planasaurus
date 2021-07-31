export default class FieldEntry {
    id: number = 0;
    field_id: number = 0;
    key: string = '';
    value: any;

    static arrayFromData(data: object | string): Array<FieldEntry> {
        if (typeof data == "string") {
            let arr = JSON.parse(data);
            return arr as Array<FieldEntry>;
        } else if (Array.isArray(data)) {
            return data as Array<FieldEntry>;
        }
        return [];
    }
}