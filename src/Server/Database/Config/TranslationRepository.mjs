import IRepository from "@cavalcando/base/src/Repository/IRepository.mjs";
import ConnectionContainer from "../../Container/ConnectionContainer.mjs";
import User from '../../Model/Administration/User.mjs';

export default class TranslationRepository extends IRepository {
    constructor () {
        super();
        this.collection = ConnectionContainer.arangoConfig.collection('Translation');
    }

    async createIndex(){
        const indexes = new Map([
            [
                'lang',
                {
                    type: 'skiplist',
                    fields: ['lang'],
                    unique: true,
                    sparse: false,
                }
            ]
        ]);
       await this._createIndexes(this.collection, indexes)
    }

    async getAll () {
    
    }

    async getById (id) {
    }

    async getByLang (lang) {
        const result = await this.collection.byExample({'lang': lang});
        const entry = await result.next();
        
        if (!Boolean(entry)) {
            return null;
        }
        return entry;
    }
}
