import dotenv from 'dotenv';
import SocketServer from '../Network/SocketServer';
import Webserver from '../Network/Webserver';
import Services from '../Service/Services';
import Factory from "../Database/Factory";
import ConnectionContainer from "../Container/ConnectionContainer";
import MemoryContainer from "../Container/MemoryContainer";

export default class Server {
    constructor () {
        dotenv.config();
        ConnectionContainer.init().then(() => {
            Factory.init();
            MemoryContainer.init().then(() => {
                Services.init();
                this.webserver = new Webserver();
                this.socketServer = new SocketServer();
            });
        });
    }
}
