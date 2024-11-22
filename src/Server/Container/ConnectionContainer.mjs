import {Database} from 'arangojs';
import {createClient} from 'redis'
export default class ConnectionContainer {
    static arangoConfig = null;
    static arangoAdministration = null;
    static arango = null;
    static redis = null;

    static async init () {
        await this._connectRedis();
        await this._connectArangoConfig();
        await this._connectArangoAdmin();
        await this._connectArangoGame();
    }

    static async _connectRedis () {
        ConnectionContainer.redis = createClient({
            url: `redis://${process.env.REDIS_USE_AUTH === 'true' ? process.env.REDIS_USER+":"+process.env.REDIS_PW : ""}${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        })
            .on('error', err => console.log('Redis Client Error', err));
        
        await ConnectionContainer.redis.connect();    

        if (ConnectionContainer.redis.isReady) {
            console.info('Redis Connection ready');
        };
    }

    static async _connectArangoConfig() {
        ConnectionContainer.arangoConfig = await this._connectArango(process.env.ARANGO_DB_Config);
    }

    static async _connectArangoAdmin () {
        ConnectionContainer.arangoAdministration = await this._connectArango(process.env.ARANGO_DB_Admin);

    }

    static async _connectArangoGame () {
        ConnectionContainer.arango = await this._connectArango(process.env.ARANGO_DB_Game);
    }

    static async _connectArango (db) {
        const object = new Database({
            url: `http://${process.env.ARANGO_HOST}:${process.env.ARANGO_PORT}`,
            databaseName:db,
            auth: {username: process.env.ARANGO_USER, password: process.env.ARANGO_PW}
        });

        /** HTTPS Version
         *  const encodedCA = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMrakNDQWVLZ0F3SUJBZ0lSQUtuQW15a2ZyNEE5N1dHZ1ZvcEwzWU13RFFZSktvWklodmNOQVFFTEJRQXcKSmpFUk1BOEdBMVVFQ2hNSVFYSmhibWR2UkVJeEVUQVBCZ05WQkFNVENFRnlZVzVuYjBSQ01CNFhEVEl4TURNeQpNVEV6TkRZeE0xb1hEVEkyTURNeU1ERXpORFl4TTFvd0pqRVJNQThHQTFVRUNoTUlRWEpoYm1kdlJFSXhFVEFQCkJnTlZCQU1UQ0VGeVlXNW5iMFJDTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEKN2hFMkM0bXUxTG1oZGdrT24wNHRLUG9ma3hIcDNvSHN0WEttbEtyUTduK0F1ZEdPSzZuLy9wRFp4QUhYTUlYYQo0WlBzTTZSSG45amxJZlZGd2ZuU1pFc04zaXF3enVRN1ZXR1NucHNyekxheFp1Y05mek9RMFg1clQraWYrWjVuCjRsRkF6d2hDNVFVNWpNR09Db1FUVU9WOWtKc3ljZmJOT1RKL3ZucFlMblRURHlpSWdQVGFRYmpHeTdRMDY0NWsKUU93MUtjRHlvWDRPWXRwcHFQeENEZ20rdGEwemJLOFVMWGtyeTRLK04xUW9tMXFrQ0hWRVdldWVXV1pJRzVDNwpteklZbEdLMk5ja3YxcFphK3pJMU1xYkpkOTJtNWMyc1dzVHJEaTZ0Y21kOXphblA0UzVMRkZ4ZzFlYkcwVGhHCm1VeUJvSmhjQmtDcHBEM0I0VE5HWXdJREFRQUJveU13SVRBT0JnTlZIUThCQWY4RUJBTUNBcVF3RHdZRFZSMFQKQVFIL0JBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQUh2aWtXUG9RRlFnZXI3M3lnTENOa29tSwpVS2JjV2NVUkF1UHg3UGVNcmJZbFhFTDVUUnlwSFFZNlJ2Ym9NRkxyMFZEdTh2WjhxZW9kUUR5SlFkYSt5VThECmtQT08xUFJZZ2dPUjgrdEk5YXB2RU5MWEIrZzExTExQNVhpL2oya2dLc09WckExMDRCVXl6ZXBaUCttVWF6UHcKaGVpeVpCMkh1RTlDdzJRSm4wUWttZzNRbUhtaUV5SmE3Nk1od1BST1B2dk1qOVIySmRLcnNXQXk5RkdRbW1XNwpnVlEyaTRNZVBBNHZkYURDOGFaV3p5d2c0Z1V1MHN6ZGsyWGxyY0ovYWZsSmhxL0JSWHBNWFVZeVduRXF0enJRCjFoNjFTRWhEL0l2SkZQam9aTTJwZS9kcUVkZDJHVXYwT2YzZ3JodHFyUWMxREFzK0JUUjVsVzdITy9TSjVBPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=";
         *  const object = new Arango({
         *      url: `https://${process.env.ARANGO_HOST}:${process.env.ARANGO_PORT}`,
         *      gentOptions: {ca: Buffer.from(encodedCA, "base64"), maxSockets: 32}
         *  });
         */

        try {
            const collections = await object.listCollections();
            console.info(`Arango Connection established - ${db}`);
            console.info(`Arango Collections found in ${db}: ` + collections.length);
        } catch (e) {
            console.error('Arango connection failed', e);

            return new Promise(resolve => resolve());
        }
        return object;
    }
}
