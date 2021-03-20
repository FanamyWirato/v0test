import Event from '@cavalcando/base/src/Util/Event';
import MemoryContainer from '@cavalcando/base/src/Util/MemoryContainer';
import http from 'http';
import IO from 'socket.io';

/**
 * Handle websocket connections.
 */
export default class SocketServer {
    constructor () {
        this.io = null;
        this.http = null;
        this.startup()
            .then(() => {
                console.info('Websocket Server startup finished');
            })
            .catch(() => console.warning('Unable to start Websocket server'));
    }


    /**
     * Starts the server.
     *
     * @returns {Promise<void>}
     */
    async startup () {
        this.http = http.createServer();
        this.io = new IO(this.http);
        this.events = new Event();

        this.io.on('connection', socket => {
            socket.emit('connection', '');
            socket.on('disconnect', () => {
                if (socket.uid) {
                    const obj = MemoryContainer.activeUsers.get(socket.uid);
                    if (obj !== null) {
                        if (Object.keys(obj.sockets).length > 1) {
                            delete MemoryContainer.activeUsers.get(socket.uid).sockets[socket.id];
                        } else {
                            MemoryContainer.activeUsers.delete(socket.uid);
                        }
                    }

                }
            });
        });

        this.http.listen(process.env.WEBSOCKET_PORT);
        console.info(`WebSocket Server running on port ${ process.env.WEBSOCKET_PORT }`);
    }
}