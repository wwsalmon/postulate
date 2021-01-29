import NextAuth, {InitOptions} from "next-auth";
import Providers from "next-auth/providers";
import {NextApiRequest, NextApiResponse} from "next";
import mongoose from "mongoose";
import {UserModel} from "../../../models/user";
import {SessionObj} from "../../../utils/types";

const options: InitOptions = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        session: async (session, user) => {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });

            const foundUser = await UserModel.findOne({ email: user.email }).exec();

            let newSession: SessionObj = {
                ...session,
                userId: "",
            }

            if (foundUser) {
                newSession.userId = foundUser._id;
            }

            return newSession;
        },
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);