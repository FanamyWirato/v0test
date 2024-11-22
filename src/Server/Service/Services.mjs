import Authentication from './Authentication.mjs';

export default class Services {
    static init () {
        this.authentication = new Authentication();
    }
}
