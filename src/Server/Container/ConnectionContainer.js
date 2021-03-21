export default class ConnectionContainer {
    static async init () {
        await this._connectRedis();
        await this._connectArangoConfig();
        await this._connectArangoAdmin();
        await this._connectArangoGame();
    }

    static async _connectRedis () {

    }

    static async _connectArangoConfig() {
        await this._connectArango();
    }

    static async _connectArangoAdmin () {
        await this._connectArango();
    }

    static async _connectArangoGame () {
        await this._connectArango();
    }

    async static _connectArango () {

    }
}
