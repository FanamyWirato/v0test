import IRepository from "@cavalcando/base/src/Repository/IRepository.mjs";
import ConnectionContainer from "../../Container/ConnectionContainer.mjs";
import User from '../../Model/Administration/User.mjs';

export default class UserRepository extends IRepository {
    constructor () {
        super();
        this.collection = ConnectionContainer.arangoAdministration.collection('User');
    }

    async createIndex(){
        const indexes = new Map([
            [
                'username',
                {
                    type: 'skiplist',
                    fields: ['username'],
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

    async getByUsername (username) {
        const result = await this.collection.byExample({'username': username});
        const entry = await result.next();
        
        if (!Boolean(entry)) {
            return null;
        }
        return new User(entry);
    }
}
