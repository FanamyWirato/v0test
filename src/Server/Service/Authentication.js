import Factory from "../Database/Factory";
import User from "../Model/Administration/User";
import {createHash} from 'crypto';
import MemoryContainer from "../Container/MemoryContainer";

export default class Authentication {
    static salt = 'superD00perC3v4lc4nd0'

    /**
     * @param {string} user
     * @param {string} pw
     */
    async login (user, pw) {
        // pepper is the created date of the user as date string with millisecond
        const uObj = await Factory.administration.user.getByUsername(user);
        if(uObj === null) {
            return;
        }

        const loginHash = this.generatePWHash(pw, uObj.created.format(process.env.DATETIMEFORMAT));
        if(loginHash === uObj.password) {
            MemoryContainer.activeUsers.set(uObj.username, {obj: uObj, socket: null});
        }
    }

    generatePWHash (pw, pepper) {
        const value =  `${Authentication.salt}-${pw}-${pepper}`;
        return createHash('sha256').update(value).digest('base64');
    }
}
