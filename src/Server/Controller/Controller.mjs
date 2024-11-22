import { Socket } from 'socket.io';

/**
 * @param {string} eventName
 * @param {Socket} socket
 * @param {object} data
 */
export default class Controller {
    static route = "xx:xx";
    static authorization = null;
    static showInNav = false;
    socket = null;
    data = null;

    constructor(socket, data) {
        this.socket = socket;
        this.data = data;
    }

    /**
     * Executes the given event.
     * We're now in an instanciated phase.
     */
    execute() {

        console.warn('No execute defined, please add: ' + this.eventName);
    }
}
