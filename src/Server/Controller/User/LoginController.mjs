import Controller from "../Controller.mjs";
import Services from "../../Service/Services.mjs";
import ErrorEmitModel from "@cavalcando/base/src/Model/Emit/ErrorEmitModel.mjs";
import SuccessEmitModel from "@cavalcando/base/src/Model/Emit/SuccessEmitModel.mjs";
import User from '../../Model/Administration/User.mjs';
import MemoryContainer from "../../Container/MemoryContainer.mjs";
import moment from 'moment';
import ConnectionContainer from "../../Container/ConnectionContainer.mjs";

export default class LoginController extends Controller {
    static route = "User:Login"
    static authorization = "unauthorized"

    async execute() {
        const valid = this._validateData(this.data);
        if (valid) {
            if(this.useLssk){
                if(await this._loginLssk(this.data)) {
                    return this._setUserData();
                }
            }

            if (await Services.authentication.login(this.data.username, this.data.password)) {
                return this._setUserData();
            }

            this.socket.emit(LoginController.route, new ErrorEmitModel("Could not login"));
        }
    }

    _validateData(data) {
        if ((!data.username || !data.password) && !data.lssk){
            this.socket.emit(LoginController.route, new ErrorEmitModel('Form incomplete!'));

            return false;
        }

        if (!/^[0-9a-zA-Z]+$/.test(data.username)) {
            this.socket.emit(LoginController.route, new ErrorEmitModel('Invalid username format!'));

            return false;
        }

        if (data.lssk) {
            if (!/[-A-Za-z0-9+/=]{44}$/.test(data.lssk)) {
                this.socket.emit(this.eventName, new ErrorEmitModel('Invalid Session Key'));

                return false;
            }

            this.useLssk = true;
        }

        return true;
    }

    /**
     * @param {string} uid
     * @param {string} name
     * @returns {Promise<object>}
     * @private
     */
    async _setUserData() {
        if (MemoryContainer.activeUsers.get(this.data.username) === undefined) {
            MemoryContainer.activeUsers.set(this.data.username, {
                user: new User(this.data),
                sockets: {}
            });
        }

        MemoryContainer.activeUsers.get(this.data.username).sockets[this.socket.id] = this.socket;
        this.socket.username = this.data.username;
        
        this.socket.emit(LoginController.route, new SuccessEmitModel({username: this.data.username}));
        if(this.data.remember) {
            const ttlHours = 24;
            const now = moment().add(ttlHours, 'h');
            const hash = await this._createLSSK(this.data.username, ttlHours);
            this.socket.emit(LoginController.route+":Remember", new SuccessEmitModel({key: hash, validUntil: now}))
        }
        return new User(this.data);
    }

    /**
     * @param {object} data
     * @returns {Promise<boolean>}
     * @private
     */
    async _loginLssk(data) {
        const user = await ConnectionContainer.redis.get(data.lssk);
        if (user === null) {
            this.socket.emit(this.eventName, new ErrorEmitModel('Session expired'));

            return false;
        }
        return true;
    }

        /**
     * @param {User} user
     * @param {number} ttlHours
     * @returns {Promise<void>}
     * @private
     */
        async _createLSSK(username, ttlHours) {
            const hash = Services.authentication.generateLSSKHash();
            
            await ConnectionContainer.redis.set(hash, username, {
                EX: ttlHours * 60 * 60,
            });
    
            return hash;
        }
}
