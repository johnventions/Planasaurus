export default class SiteSession {
    id: Number = 0;
    workspace: Number = 0;
    lastCheck: Number = Date.now();

    static load(req: any) {
        let s = new this();
        const user = req.user ? req.user : {};
        s.id = user.id;
        s.workspace = user.workspace;
        s.lastCheck = user.lastCheck;
        return s;
    }
}