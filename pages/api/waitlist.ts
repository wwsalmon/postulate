import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.email || !req.body.url) return res.status(405).json({message: "Missing email or URL in request body"});

    try {
        await axios.post("https://api.sendinblue.com/v3/contacts", {
            email: req.body.email,
            listIds: [5], // add to waitlist
            updateEnabled: true,
        }, {
            headers: { "api-key": process.env.SENDINBLUE_API_KEY },
        });

        const waitlistApiRes = await axios.post("https://getwaitlist.com/api/v1/waitlists/submit", {
            email: req.body.email,
            api_key: process.env.WAITLIST_API_KEY,
            referral_link: req.body.url,
        });

        return res.status(200).json({data: waitlistApiRes.data});
    } catch (e) {
        return res.status(500).json({data: e});
    }
}