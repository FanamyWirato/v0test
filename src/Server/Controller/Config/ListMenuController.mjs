import MemoryContainer from "../../Container/MemoryContainer.mjs";
import SuccessEmitModel from "@cavalcando/base/src/Model/Emit/SuccessEmitModel.mjs";
import Controller from "../Controller.mjs";
export default class ListMenuController extends Controller {
    static route = "Config:ListMenu"
    static authorization = "authorized"

    async execute() {
        const list = new Map([...MemoryContainer.events.events['authorized']].filter(([route, item]) => item.default.showInNav)).keys();
        const structuredList = new Map();
        for (let route of list) {
            const [category, name] = route.split(':');
            if (!structuredList.has(category)) {
                structuredList.set(category, []);
            }
            structuredList.get(category).push(name);
        }

        this.socket.emit(ListMenuController.route, new SuccessEmitModel({nav: structuredList}));
    }
}