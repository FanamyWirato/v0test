import UserRepository from "./Admin/UserRepository.js";

export default class Factory {
    static administration = {};
    static config = {};
    static game = {};
    static async init () {
        // todo: create auto repository loading!
        Factory.administration.user = new UserRepository();


        await Factory.createCollections(Factory.administration);
        await Factory.creatIndexes(Factory.administration);
    }

    static createCollections(collectionGroup) {
        const promiseGroup = [];
        for(const repo of Object.values(collectionGroup)) {
            promiseGroup.push(repo.createCollection());
        }
        return Promise.all(promiseGroup);
    }

    static async creatIndexes(collectionGroup) {
        const promiseGroup = [];
        for(const repo of Object.values(collectionGroup)) {
            promiseGroup.push(repo.createIndex());
        }
        return Promise.all(promiseGroup);
    }
}
