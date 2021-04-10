import IRepository from "@cavalcando/base/src/Repository/IRepository.mjs";
import ConnectionContainer from "../../Container/ConnectionContainer";


export default class UserRepository extends IRepository{
    constructor() {
        super();
        this.collection = ConnectionContainer.arangoAdministration.collection('User');
    }

    async createCollection () {
        return Promise.resolve(undefined);
    }

    async getAll() {

    }

    async getById(id) {

    }

    async getByUsername(username) {
        const result = await this.collection.byExample({'username' : username});
        if(!result.hasNext()) {
            return null;
        }



        console.log(result.hasNext());
        console.log(await result.next());
    }
}
