import {readdir} from 'node:fs/promises';
import User from '../Model/Administration/User.mjs';
import MemoryContainer from '../Container/MemoryContainer.mjs';

/**
 */
export default class Event {
    /**
     * Because ctor can't be async ffs.
     *
     * @returns {Promise<void>}
     */
    async init() {
        this.events = {};
        const dirs = await readdir("src/Server/Controller", {recursive: true});

        for (let property of dirs) {
            const entry = property.split('/');
            if (entry.length > 1) {
                const imported = await Event.importModule(entry[0], entry[1]);
                if(imported) {
                    if(this.events[imported.default.authorization] == null) {
                        this.events[imported.default.authorization] = new Map();
                    }
                    this.events[imported.default.authorization].set(imported.default.route, imported);
                }
            }

        }
    }

    /**
     * @param {Socket} socket
     */
    addEventsUnauthorized(socket) {
        if (!this.events['unauthorized']) {
            console.error(`Event Type not found: unauthorized}`);

            return;
        }
        for (let [eventName, module] of this.events['unauthorized']) {
            socket.on(eventName, async data => {
                const controller = new module.default(socket, data);
                const response = await controller.execute();
                if(response instanceof User && MemoryContainer.activeUsers.get(response.username)) {
                    this._addEventsAuthorized(socket);
                    console.log(`${response.username}: Connection upgraded`);
                }
            });
        }
    }

    /**
     * @param {Socket} socket
     * @private
     */
    _addEventsAuthorized(socket) {
        if (!this.events['authorized']) {
            console.error(`Event Type not found: authorized}`);

            return;
        }
        for (let [eventName, module] of this.events['authorized']) {
            socket.on(eventName, data => {
                console.info('event fired: ' + eventName);
                const controller = new module.default(socket, data);
                controller.execute();
            });
        }
    }

    /**
     * @param {string} directory
     * @param {string} controller
     * @returns {(object|null)}
     */
    static async importModule(directory, controller) {
        try {
            return await import(`../Controller/${directory}/${controller}`);
        } catch (e) {
            console.error(`${directory}:${controller} not found`);
            console.log(e);
            return null;
        }
    }
}
