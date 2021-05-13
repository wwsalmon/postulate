import {NextApiRequest, NextApiResponse} from "next";
import CryptoJS, {AES} from "crypto-js";
import dbConnect from "../../utils/dbConnect";
import {SubscriptionModel} from "../../models/subscription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        if (!req.query.emailHash || !req.query.projectId || Array.isArray(req.query.emailHash) || Array.isArray(req.query.projectId)) return res.status(406);

        try {
            await dbConnect();

            const decryptedEmail = AES.decrypt(req.query.emailHash, process.env.SUBSCRIBE_SECRET_KEY).toString(CryptoJS.enc.Utf8);

            await SubscriptionModel.deleteOne({email: decryptedEmail, targetId: req.query.projectId});

            return res.status(200).json({message: "Subscription deleted"});
        } catch (e) {
            return res.status(500).json({message: e});
        }
    } else if (req.method === "GET") {
        if (!req.query.emailHash || Array.isArray(req.query.emailHash)) return res.status(406);

        try {
            await dbConnect();

            const decryptedEmail = AES.decrypt(req.query.emailHash, process.env.SUBSCRIBE_SECRET_KEY).toString(CryptoJS.enc.Utf8);

            const subscriptions = await SubscriptionModel.aggregate([
                {$match: {email: decryptedEmail}},
                {$lookup: {
                    from: "projects",
                    let: {"projectId": "$targetId"},
                        pipeline: [
                            {$match: {$expr: {$eq: ["$_id", "$$projectId"]}}},
                            {$lookup: {from: "users", localField: "userId", foreignField: "_id", as: "ownerArr"}},
                        ],
                    as: "projectArr"
                }}
            ]);

            return res.status(200).json({subscriptions: subscriptions});
        } catch (e) {
            return res.status(500).json({message: e});
        }
    } else return res.status(405);
}