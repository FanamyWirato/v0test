import IRepository from "@cavalcando/base/src/Repository/IRepository.mjs";
import ConnectionContainer from "../../Container/ConnectionContainer";


export default class UserRepository extends IRepository{
    constructor() {
        super();
        //this.collection = ConnectionContainer.
    }

    async createCollection () {
        return Promise.resolve(undefined);
    }
}
