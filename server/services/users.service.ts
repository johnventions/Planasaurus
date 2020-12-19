const { getSQLPool } = require('../sql');
import userQueries from '../queries/query.users';


export default class UserService {
    constructor() {

    }

    async createOrGetUser(method: string, user: any) {
        const pool = await getSQLPool;
        let dbUser = await userQueries.getUser(pool, method, user);
        if (dbUser.recordset.length == 0) {
            // create new user
            const newUserInsert = await userQueries.createUser(pool, method, user);
            const id = newUserInsert.recordset[0].id;
            dbUser = await userQueries.getUserById(pool, id);
            // get new user from the DB
            return dbUser.recordset[0];
        }
        return dbUser.recordset[0];
    }

    async getUserById(id: Number) {
        const pool = await getSQLPool;
        const dbUser = await userQueries.getUserById(pool, id);
        return dbUser.recordset[0];
    }
}