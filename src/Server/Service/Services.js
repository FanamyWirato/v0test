import Authentication from './Authentication';

export default class Services {
    static init () {
        this.authenticationService = new Authentication();
    }
}
