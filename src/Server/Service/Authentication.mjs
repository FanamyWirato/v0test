import Factory from "../Database/Factory.mjs";
import User from "../Model/Administration/User.mjs";
import MemoryContainer from "../Container/MemoryContainer.mjs";
import crypto from 'crypto';

// TODO: crypto package is depcreated - update!
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
            return false;
        }

        const loginHash = this.generatePWHash(user, pw, uObj.created.format(process.env.DATETIMEFORMAT));
        if(loginHash === uObj.password) {
            return true;
        }
    }

    generatePWHash (username, pw, pepper) {
        const key =  crypto.createHash('sha512').update(`hi there :3 ${pepper}`).digest('hex').substring(0,32);
        const encryption = crypto.createHash('sha512').update(`${pepper}:${Authentication.salt}`).digest('hex').substring(0, 16)

        const cipher = crypto.createCipheriv(process.env.ENCRYPTION_METHOD, key, encryption)
        return Buffer.from(
            cipher.update(`${pw}:${username}@ap`, 'utf8', 'hex') + cipher.final('hex')
        ).toString('base64')
    }

    generateLSSKHash(){
        const rndString = [...Array(64)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
        return crypto.createHash('sha256')
                .update(rndString)
                .digest('base64');
    }
}
