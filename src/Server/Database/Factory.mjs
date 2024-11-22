import UserRepository from "./Admin/UserRepository.mjs";
import TranslationRepository from "./Config/TranslationRepository.mjs";

export default class Factory {
    static administration = {};
    static config = {};
    static game = {};
    static async init () {
        // todo: create auto repository loading!
        Factory.administration.user = new UserRepository();
        Factory.config.translation = new TranslationRepository();


        await Factory.createCollections(Factory.administration);
        await Factory.createCollections(Factory.config);
        await Factory.creatIndexes(Factory.administration);
        await Factory.creatIndexes(Factory.config);
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
