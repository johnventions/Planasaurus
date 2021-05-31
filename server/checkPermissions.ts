import UserServie from "./services/users.service";
import UploadService from "./services/upload.service";
import SiteSession from './models/session';

const checkPermissions = function(action: string, resource: [string] ) {
    return async (req: any, res: any, next: Function) => {
        let workspace = Number(req.headers['pterobyte-workspace']);
        try {
            const sessionUser = SiteSession.load(req);
            if (!sessionUser.id) throw new Error('Not allowed');
            const permissions = await UserServie.getUserPermissions(sessionUser.id);

            let match = null;
            if (resource.indexOf('uploads') > -1) {
                // custom lookup for images since we don't have workspace values
                const guid = req.params.guid;
                const file = await UploadService.getUploadByGuid(guid);
                workspace = file.workspace;
            }

            match = permissions.find(x => x.workspace_id == workspace);
            if (!match) throw new Error('Not allowed');

            // TODO: update permissions based on type and access request
            console.log(permissions, match);
            next();
        } catch (error) {
            return res.send(403);
        }
    }
}

export default checkPermissions;
