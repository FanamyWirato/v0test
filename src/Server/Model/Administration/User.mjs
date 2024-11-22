import Document from "@cavalcando/base/src/Model/Document.mjs";

export default class User extends Document{
    #username = '';
    get username () {
        return this.#username;
    }
    set username(name) {
        this.#username = name;
    }

    #password = '';
    get password() {
        return this.#password;
    }
    set password(pw) {

        this.#password = pw;
    }

    constructor (data = null) {
        super(data);
        if(data !== null) {
            this.username = data.username;
            this.password = data.password;
        }
    }

    serialize() {
        return {
            ...super.serialize(),
            username: this.username,
            password: this.password
        }
    }
}
