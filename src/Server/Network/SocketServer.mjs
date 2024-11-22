import MemoryContainer from "../Container/MemoryContainer.mjs";
import { Server } from 'socket.io';
import { createServer } from "http";
import Event from "./Event.mjs";

/**
 * Handle websocket connections.
 */
export default class SocketServer {
    constructor () {
        this.io = null;
        this.http = createServer();
        this.event = new Event();
        this.startup()
            .then(() => {
                MemoryContainer.events = this.event;
                console.info('Websocket Server startup finished');
            })
            .catch(e => {
                console.warn('Unable to start Websocket server');
                console.warn(e);
            })
    }


    /**
     * Starts the server.
     *
     * @returns {Promise<void>}
     */
    async startup () {

        this.io = new Server(this.http, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        await this.event.init();

        this.io.on('connection', socket => {
            console.log("new connection received");
            socket.emit('connection', '');
            socket.on('disconnect', () => {
                if (socket.username) {
                    const obj = MemoryContainer.activeUsers.get(socket.username);
                    if (obj !== null) {
                        if (Object.keys(obj.sockets).length > 1) {
                            delete MemoryContainer.activeUsers.get(socket.username).sockets[socket.id];
                        } else {
                            MemoryContainer.activeUsers.delete(socket.username);
                        }
                    }

                }
            });
            this.event.addEventsUnauthorized(socket);
        });

        this.http.listen(process.env.WEBSOCKET_PORT);

        console.info(`WebSocket Server running on port ${ process.env.WEBSOCKET_PORT }`);
    }
}
