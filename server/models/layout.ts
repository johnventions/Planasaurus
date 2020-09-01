export default class Layout {
    primaryArea: object = {};
    sidebar: object = {};

    static fromData(data: any) : Layout {
        return Object.assign(new this, data);
    }
}