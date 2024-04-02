import IRepository from "@cavalcando/base/src/Repository/IRepository.js";
import ConnectionContainer from "../../Container/ConnectionContainer.js";
import User from '../../Model/Administration/User.js';

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
        if (!result.hasNext()) {
            return null;
        }
        return new User(await result.next());
    }
}
