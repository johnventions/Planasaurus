import UserServie from "./services/users.service";
import SiteSession from './models/session';

const checkPermissions = function(action: string, resource: [string] ) {
    return async (req: any, res: any, next: Function) => {
        const workspace = Number(req.headers['pterobyte-workspace']);
        try {
            const sessionUser = SiteSession.load(req);
            const permissions = await UserServie.getUserPermissions(sessionUser.id);

            const match = permissions.find(x => x.workspace_id == workspace);
            
            if (!match) throw new Error('Not allowed');

            // TODO: update permissions based on type and access request
            console.log(permissions, match);
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default checkPermissions;
