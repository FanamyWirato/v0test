import MemoryContainer from '@cavalcando/base/src/Util/MemoryContainer';
import dotenv from 'dotenv';
import SocketServer from '../Network/SocketServer';
import Webserver from '../Network/Webserver';

export default class Server {
    constructor () {
        dotenv.config();
        MemoryContainer.init();
        this.webserver = new Webserver();
        this.socketServer = new SocketServer();
    }
}