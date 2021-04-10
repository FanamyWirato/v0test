import UserRepository from "./Admin/UserRepository";

export default class Factory {
    static administration = {};
    static config = {};
    static game = {};
    static init () {
        // todo: create auto repository loading!
        Factory.administration.user = new UserRepository();
    }
}
