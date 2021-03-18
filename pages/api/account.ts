import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {UserObj} from "../../utils/types";
import axios from "axios";

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

        try {
            await axios.get(`https://api.sendinblue.com/v3/contacts/${encodeURIComponent(session.user.email)}`, {
                headers: { "api-key": process.env.SENDINBLUE_API_KEY },
            });

            await axios.put(`https://api.sendinblue.com/v3/contacts/${encodeURIComponent(session.user.email)}`, {
                listIds: [2], // add to users list
                unlinkListIds: [5], // remove from waitlist
            }, {
                headers: { "api-key": process.env.SENDINBLUE_API_KEY },
            });
        } catch (e) {
            if (e.message === "Request failed with status code 404") {
                const nameSplit = session.user.name.split(" ");
                const firstName = nameSplit.slice(0, nameSplit.length - 1).join(" ");
                const lastName = nameSplit.slice(nameSplit.length - 1, nameSplit.length);

                await axios.post("https://api.sendinblue.com/v3/contacts", {
                    email: session.user.email,
                    attributes: {
                        FIRSTNAME: firstName,
                        LASTNAME: lastName,
                    },
                    listIds: [2], // add to users list
                }, {
                    headers: { "api-key": process.env.SENDINBLUE_API_KEY },
                });
            } else {
                throw e;
            }
        }

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