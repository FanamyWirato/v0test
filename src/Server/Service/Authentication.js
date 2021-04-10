import Factory from "../Database/Factory";
import User from "../Model/Administration/User";
import {createHmac as hmac} from 'crypto';

export default class Authentication {
    static salt = 'superD00perC3v4lc4nd0'

    /**
     * @param {string} user
     * @param {string} pw
     */
    login (user, pw) {
        // pepper is the created date of the user as date string with millisecond
        Factory.administration.user.getByUsername(user);
        const userO = new User({username: "fanamy"});
        console.log(userO.created.toString());
        const hash = this.generatePWHash(pw, userO.created.toString());
        console.log(hash);
    }

    generatePWHash (pw, pepper) {
        const value =  `${Authentication.salt}-${pw}-${pepper}`;
        return hmac('sha256', value);
    }
}
