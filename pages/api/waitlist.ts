import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.email || !req.body.url) return res.status(405).json({message: "Missing email or URL in request body"});

    axios.post("https://getwaitlist.com/waitlist", {
        email: req.body.email,
        api_key: process.env.WAITLIST_API_KEY,
        referral_link: req.body.url,
    }).then(r => {
        return res.status(200).json({data: r.data});
    }).catch(e => {
        return res.status(500).json({data: e});
    });
}