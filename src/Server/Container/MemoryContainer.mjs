import Factory from '../Database/Factory.mjs';

/**
 */
export default class MemoryContainer {
    /**
     * @returns {Promise<void>}
     */
    static async init () {
        MemoryContainer.activeUsers = new Map();
        MemoryContainer.users = await Factory.administration.user.getAll();
        MemoryContainer.events = null;
    }
}
