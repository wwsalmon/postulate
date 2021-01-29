import NextAuth, {InitOptions} from "next-auth";
import Providers from "next-auth/providers";
import {NextApiRequest, NextApiResponse} from "next";
import mongoose from "mongoose";
import {UserModel} from "../../../models/user";

const options: InitOptions = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        jwt: async (token, user, account, profile, isNewUser) => {
            if (user) {
                await mongoose.connect(process.env.MONGODB_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                });

                const foundUser = await UserModel.findOne({ email: user.email }).exec();

                if (foundUser) {
                    token.userId = foundUser._id;
                }
            }

            return token;
        }
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);