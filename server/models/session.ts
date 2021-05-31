export default class SiteSession {
    id: number = 0;
    workspace: number = 0;
    lastCheck: number = Date.now();

    static load(req: any) {
        let s = new this();
        const user = req.user ? req.user : {};
        s.id = user.id;
        s.workspace = user.workspace;
        s.lastCheck = user.lastCheck;
        return s;
    }
}