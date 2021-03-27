import Arango from 'arangojs';
export default class ConnectionContainer {
    static arangoConfig = null;
    static arangoAdministration = null;
    static arango = null;

    static async init () {
        await this._connectRedis();
        await this._connectArangoConfig();
        await this._connectArangoAdmin();
        await this._connectArangoGame();
    }

    static async _connectRedis () {
        const config = {
            host: process.env.REDIS_HOST, //Can be IP or hostname
            port: process.env.REDIS_PORT,
            maxRetries: 10, //Reconnect retries, default -1 (infinity)
            db: 0, //Optional db selection
            autoConnect: true, //Will connect after creation
            //Will set connection name (you can see connections by running CLIENT LIST on redis server)
            doNotSetClientName: false,
            //When you call `end()`, driver tries to send `QUIT` command to redis before actual end
            doNotRunQuitOnEnd: false,
        };

        if (process.env.REDIS_USE_AUTH === 'true') {
            config.auth = process.env.REDIS_AUTH;
        }
        ConnectionContainer.redis = new Redis(config);
        console.info('Redis Connection established');
        ConnectionContainer.redis.on('ready', () => {
            console.info('Redis Connection ready');
        });
    }

    static async _connectArangoConfig() {
        await this._connectArango(ConnectionContainer.arangoConfig, process.env.ARANGO_DB_Config);
    }

    static async _connectArangoAdmin () {
        await this._connectArango(ConnectionContainer.arangoAdministration, process.env.ARANGO_DB_Admin);
    }

    static async _connectArangoGame () {
        await this._connectArango(ConnectionContainer.arango, process.env.ARANGO_DB_Game);
    }

    async static _connectArango (object, db) {
        object = new Arango({
            url: `http://${process.env.ARANGO_HOST}:${process.env.ARANGO_PORT}`,
            agentOptions: {maxSockets: 32}
        });
        object.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PW);
        object.useDatabase(db);

        try {
            const collections = await object.listCollections();
            console.info('Arango Connection established');
            console.info('Arango Collections found: ' + collections.length);
        } catch (e) {
            console.error('Arango connection failed', e);

            return new Promise(resolve => resolve());
        }
        return object;
    }
}
