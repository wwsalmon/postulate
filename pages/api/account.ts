import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {UserObj} from "../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({req});

    if (!session) {
        return res.status(403).json({message: "You must have an active session to create an account."});
    }

    if (!req.body.username) {
        return res.status(406).json({message: "No username found in request."});
    }

    try {
        await dbConnect();

        const emailUser = await UserModel.findOne({ "email": session.user.email });

        // if user object already exists, update it
        if (emailUser) {
            emailUser.bio = req.body.bio;
            emailUser.username = req.body.username;
            await emailUser.save();
            return res.status(200).json({message: "Profile successfully saved"});
        }

        // check if username is taken
        const usernameUser = await UserModel.findOne({ "username": req.body.username });
        if (usernameUser) return res.status(200).json({error: "An account already exists with this username."});

        const newUser: UserObj = {
            email: session.user.email,
            username: req.body.username,
            name: session.user.name,
            image: session.user.image,
            bio: "",
            featuredProjects: [],
            featuredPosts: [],
        };

        await UserModel.create(newUser);

        res.status(200).json({message: "Account successfully created."});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}