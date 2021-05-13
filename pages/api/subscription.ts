import {NextApiRequest, NextApiResponse} from "next";
import CryptoJS, {AES} from "crypto-js";
import dbConnect from "../../utils/dbConnect";
import {SubscriptionModel} from "../../models/subscription";
import {getSession} from "next-auth/client";
import axios from "axios";
import {ProjectModel} from "../../models/project";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // if unauthed post request with "email" query param, send an email to the email with a link to subscribe
    if (req.method === "POST" && req.query.email && !Array.isArray(req.query.email) && req.query.projectId && !Array.isArray(req.query.projectId)) {
        try {
            await dbConnect();

            const thisSub = await SubscriptionModel.findOne({email: req.query.email, targetId: req.query.projectId});

            // if subscription already exists, return immediately
            if (thisSub) return res.status(200).json({exists: true});

            const thisProject = await ProjectModel.findById(req.query.projectId);

            if (!thisProject) return res.status(404);

            const emailHash = AES.encrypt(req.query.email, process.env.SUBSCRIBE_SECRET_KEY).toString();

            await axios.post("https://api.sendinblue.com/v3/smtp/email", {
                to: [{email: req.query.email}],
                templateId: 11,
                params: {
                    PROJECTNAME: thisProject.name,
                    CONFIRMLINK: `${process.env.NEXTAUTH_URL}/subscribe/${encodeURIComponent(emailHash)}/${req.query.projectId}`,
                },
            }, {
                headers: { "api-key": process.env.SENDINBLUE_API_KEY },
            });

            return res.status(200).json({exists: false});
        } catch (e) {
            return res.status(500).json({message: e});
        }
    }

    let decryptedEmail;

    if (req.query.authed) {
        const session = await getSession({req});

        if (!session) return res.status(403).json({message: "unauthed"});

        decryptedEmail = session.user.email;
    } else {
        if (!req.query.emailHash || Array.isArray(req.query.emailHash)) return res.status(406);

        decryptedEmail = AES.decrypt(req.query.emailHash, process.env.SUBSCRIBE_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        // basic email validation
        if (!decryptedEmail.match(/.+@.+/)) return res.status(406);
    }

    if (req.method === "DELETE") {
        if (!req.query.projectId || Array.isArray(req.query.projectId)) return res.status(406);

        try {
            await dbConnect();

            await SubscriptionModel.deleteOne({email: decryptedEmail, targetId: req.query.projectId});

            return res.status(200).json({message: "Subscription deleted"});
        } catch (e) {
            return res.status(500).json({message: e});
        }
    } else if (req.method === "GET") {
        try {
            await dbConnect();

            if (req.query.authed && req.query.projectId && !Array.isArray(req.query.projectId)) {
                const subscription = await SubscriptionModel.findOne({
                    email: decryptedEmail,
                    targetId: req.query.projectId
                });

                if (subscription) return res.status(200).json({subscribed: true});

                return res.status(200).json({subscribed: false});
            }

            const subscriptions = await SubscriptionModel.aggregate([
                {$match: {email: decryptedEmail}},
                {
                    $lookup: {
                        from: "projects",
                        let: {"projectId": "$targetId"},
                        pipeline: [
                            {$match: {$expr: {$eq: ["$_id", "$$projectId"]}}},
                            {$lookup: {from: "users", localField: "userId", foreignField: "_id", as: "ownerArr"}},
                        ],
                        as: "projectArr"
                    }
                }
            ]);

            return res.status(200).json({subscriptions: subscriptions});
        } catch (e) {
            return res.status(500).json({message: e});
        }
    } else if (req.method === "POST") {
        // only valid if logged in
        if (!req.query.authed) return res.status(403).json({message: "unauthed"});

        if (!req.query.projectId || Array.isArray(req.query.projectId)) return res.status(406);

        try {
            await dbConnect();

            const thisSub = await SubscriptionModel.findOne({email: decryptedEmail, targetId: req.query.projectId});

            if (thisSub) return res.status(304).json({message: "Subscription already exists"});

            await SubscriptionModel.create({
                targetType: "project",
                targetId: req.query.projectId,
                email: decryptedEmail,
            });

            return res.status(200).json({message: "Subscription created"});
        } catch (e) {
            return res.status(500).json({message: e});
        }
    } else return res.status(405);
}