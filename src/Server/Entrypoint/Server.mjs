import dotenv from 'dotenv';
import SocketServer from '../Network/SocketServer.mjs';
import Webserver from '../Network/Webserver.mjs';
import Services from '../Service/Services.mjs';
import Factory from "../Database/Factory.mjs";
import ConnectionContainer from "../Container/ConnectionContainer.mjs";
import MemoryContainer from "../Container/MemoryContainer.mjs";
import TranslationContainer from "../Container/TranslationContainer.mjs";

export default class Server {
    constructor () {
        this.optimizeSerialization();
        dotenv.config();
        ConnectionContainer.init().then(() => {
            Factory.init().then(() => {
                MemoryContainer.init().then(() => {
                    TranslationContainer.init().then(() => {
                        Services.init();
                        this.webserver = new Webserver();
                        this.socketServer = new SocketServer();
                    })
                });
            });
        });
    }

     /**
     * Override serialization methods.
     */
     optimizeSerialization() {
        Map.prototype.toJSON = function () {
            let result = {};

            this.forEach((entry, index) => {
                result[index] = 'toJSON' in entry ? entry.toJSON() : entry;
            });

            return result;
        };

        Set.prototype.toJSON = function () {
            const data = [];
            for (const entry of this.values()) {
                data.push('toJSON' in entry ? entry.toJSON() : entry);
            }

            return data;
        };
    }
}

