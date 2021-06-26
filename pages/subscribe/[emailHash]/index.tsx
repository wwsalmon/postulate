import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import CryptoJS, {AES} from "crypto-js";
import dbConnect from "../../../utils/dbConnect";
import UpBanner from "../../../components/UpBanner";
import {SubscriptionModel} from "../../../models/subscription";
import useSWR, {responseInterface} from "swr";
import {DatedObj, SubscriptionObjGraph} from "../../../utils/types";
import {fetcher} from "../../../utils/utils";
import {useState} from "react";
import axios from "axios";
import H1 from "../../../components/style/H1";
import UpSEO from "../../../components/up-seo";
import SubscriptionItem from "../../../components/SubscriptionItem";

export default function ManageSubscriptions({email, emailHash, authed}: {email: string, emailHash: string, authed: boolean}) {
    const [iter, setIter] = useState<number>(0);
    const {data, error}: responseInterface<{subscriptions: DatedObj<SubscriptionObjGraph>[]}, any> = useSWR(`/api/subscription?emailHash=${encodeURIComponent(emailHash)}&iter=${iter}`, fetcher);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Your subscriptions" noindex={true}/>
            <UpBanner className="mb-8">
                <p>
                    Managing subscriptions for <b>{email}</b>
                </p>
            </UpBanner>
            <H1 className="mb-8">Your subscriptions</H1>
            <p className="my-8">You are currently receiving email notifications for posts published in the following projects:</p>
            {data && data.subscriptions && data.subscriptions.length ? data.subscriptions.map((subscription, i) => (
                <SubscriptionItem
                    subscription={subscription}
                    setIter={setIter}
                    iter={iter}
                    emailHash={emailHash}
                    i={i}
                    key={subscription.targetId}
                />
            )) : (
                <p className="up-gray-400">You are not subscribed to any projects.</p>
            )}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context.query.emailHash === "authed") {
        const session = await getSession(context);
        if (!session || !session.userId) return {notFound: true};
        return {props: {email: session.user.email, authed: true, emailHash: AES.encrypt(session.user.email, process.env.SUBSCRIBE_SECRET_KEY).toString()}};
    }

    const decryptedEmail = AES.decrypt(context.query.emailHash, process.env.SUBSCRIBE_SECRET_KEY).toString(CryptoJS.enc.Utf8);

    // basic email validation
    if (!decryptedEmail.match(/.+@.+/)) return {notFound: true};

    try {
        await dbConnect();

        const thisSub = await SubscriptionModel.findOne({email: decryptedEmail});

        if (thisSub) return {props: {email: decryptedEmail, emailHash: context.query.emailHash, authed: false}};

        return {notFound: true};
    } catch (e) {
        return {notFound: true};
    }
}