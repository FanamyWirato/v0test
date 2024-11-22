import Controller from "../Controller.mjs";
import User from "../../Model/Administration/User.mjs";
import Factory from "../../Database/Factory.mjs";
import Services from "../../Service/Services.mjs";
import SuccessEmitModel from "@cavalcando/base/src/Model/Emit/SuccessEmitModel.mjs";
import ErrorEmitModel from "@cavalcando/base/src/Model/Emit/ErrorEmitModel.mjs";

export default class CreateController extends Controller {
    static route = "User:Create"
    static authorization = "unauthorized"

    async execute() {
        const model = new User(this.data);
        // TODO: add validation
        model.password = Services.authentication.generatePWHash(this.data.username, this.data.password, model.created.format(process.env.DATETIMEFORMAT));
        const userCheck = await Factory.administration.user.getByUsername(model.username);

        if(userCheck !== null) {
            this.socket.emit(CreateController.route, new ErrorEmitModel("Username already taken"));
            return;
        }

        await Factory.administration.user.save(model);
        if(model._key) {
            this.socket.emit(CreateController.route, new SuccessEmitModel())
        } else {
            this.socket.emit(CreateController.route, new ErrorEmitModel("Could not create User"));
        }
    }
}
