import Controller from "../Controller.mjs";
export default class CreateController extends Controller {
    static route = "Groundline:Create";
    static authorization = "authorized";
    static showInNav = true;

    async execute() {
        console.log("Controller found");
    }
}