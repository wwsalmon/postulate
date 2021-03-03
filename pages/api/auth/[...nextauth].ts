import NextAuth, {InitOptions} from "next-auth";
import Providers from "next-auth/providers";
import {NextApiRequest, NextApiResponse} from "next";
import {UserModel} from "../../../models/user";
import {SessionObj} from "../../../utils/types";
import dbConnect from "../../../utils/dbConnect";

const options: InitOptions = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        session: async (session, user) => {
            await dbConnect();

            const foundUser = await UserModel.findOne({ email: user.email }).exec();

            let newSession: SessionObj = {
                ...session,
                userId: "",
                username: "",
                featuredProjects: [],
            }

            if (foundUser) {
                newSession.userId = foundUser._id;
                newSession.username = foundUser.username;
                newSession.featuredProjects = foundUser.featuredProjects;
            }

            return newSession;
        },
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);