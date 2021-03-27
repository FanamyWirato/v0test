import Factory from '../Database/Factory';

/**
 */
export default class MemoryContainer {
    /**
     * @returns {Promise<void>}
     */
    static async init () {
        MemoryContainer.activeUsers = new Map();
        MemoryContainer.users = await Factory.userRepository.getAll();
    }
}
