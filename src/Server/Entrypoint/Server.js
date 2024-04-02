import dotenv from 'dotenv';
import SocketServer from '../Network/SocketServer.js';
import Webserver from '../Network/Webserver.js';
import Services from '../Service/Services.js';
import Factory from "../Database/Factory.js";
import ConnectionContainer from "../Container/ConnectionContainer.js";
import MemoryContainer from "../Container/MemoryContainer.js";

export default class Server {
    constructor () {
        dotenv.config();
        ConnectionContainer.init().then(() => {
            Factory.init().then(() => {
                MemoryContainer.init().then(() => {
                    Services.init();
                    this.webserver = new Webserver();
                    this.socketServer = new SocketServer();
                });
            });
        });
    }
}
