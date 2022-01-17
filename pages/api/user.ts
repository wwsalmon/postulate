import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res400, res403, res404, res200} from "next-response-helpers";
import {UserModel} from "../../models/user";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id} = req.query;

        if (!id) return res400(res);

        const user = await UserModel.findById(id);

        if (!user) return res404(res);

        return res200(res, {user});
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {id, name, username, email, image, bio} = req.body;

        if (id) {
            // todo: implement account updating
            return res400(res);
        }

        if (!(name && username && email && image)) return res400(res);

        const existingUser = await UserModel.findOne({username: username});

        if (existingUser) return res200(res, {error: "usernameError"});

        await UserModel.create({name, username, email, image, bio: "New Postulate user", featuredProjects: []});

        return res200(res);
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {

    },
    allowUnAuthed: true
});

export default handler;