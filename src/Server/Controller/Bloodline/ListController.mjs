import Controller from "../Controller.mjs";
export default class LoginController extends Controller {
    static route = "Groundline:List";
    static authorization = "authorized";
    static showInNav = true;

    async execute() {
        console.log("Controller found");
    }
}