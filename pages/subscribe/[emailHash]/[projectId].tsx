import {GetServerSideProps} from "next";
import CryptoJS, {AES} from "crypto-js";
import dbConnect from "../../../utils/dbConnect";
import {SubscriptionModel} from "../../../models/subscription";
import {ProjectModel} from "../../../models/project";
import {cleanForJSON} from "../../../utils/utils";
import {DatedObj, ProjectObjWithOwner} from "../../../utils/types";
import {useState} from "react";
import axios from "axios";
import * as mongoose from "mongoose";
import Link from "next/link";
import UpButton from "../../../components/UpButton";
import UpSEO from "../../../components/up-seo";
import {FiCheckCircle} from "react-icons/fi";

export default function SubscriptionProjectPage({email, emailHash, projectData, exists}: {email: string, emailHash: string, projectData: DatedObj<ProjectObjWithOwner>, exists: boolean}) {
    const [unsubscribed, setUnsubscribed] = useState<boolean>(false);

    function onUnsubscribe() {
        axios.delete(`/api/subscription?emailHash=${encodeURIComponent(emailHash)}&projectId=${projectData._id}`).then(() => {
            setUnsubscribed(true);
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Successfully subscribed to project" noindex={true}/>
            {unsubscribed ? (
                <p className="content">
                    Your email {email} will no longer receive notifications when posts are published in the project <Link href={`/@${projectData.ownerArr[0].username}/${projectData.urlName}`}><a className="underline">{projectData.name} by {projectData.ownerArr[0].name}</a></Link>.
                </p>
            ) : (
                <>
                    <div className="mb-8 text-4xl">
                        <FiCheckCircle/>
                    </div>
                    <p className="content">Your email {email} <b>{exists ? "is already subscribed" : "has been subscribed"}</b> to the project <Link href={`/@${projectData.ownerArr[0].username}/${projectData.urlName}`}><a className="underline">{projectData.name} by {projectData.ownerArr[0].name}</a></Link>. You will receive an email whenever a post is published in the project.</p>
                    <hr className="my-8"/>
                    <div className="flex">
                        <UpButton
                            text={true}
                            onClick={onUnsubscribe}
                            className="ml-auto"
                        >
                            {exists ? "Unsubscribe" : "Undo"}
                        </UpButton>
                        <UpButton
                            text={true}
                            href={`/subscribe/${encodeURIComponent(emailHash)}`}
                            className="ml-2"
                        >
                            See all subscriptions
                        </UpButton>
                    </div>
                </>
            )}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const decryptedEmail = AES.decrypt(context.query.emailHash, process.env.SUBSCRIBE_SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (Array.isArray(context.query.projectId)) return {notFound: true};

    try {
        await dbConnect();

        const thisSub = await SubscriptionModel.findOne({email: decryptedEmail, targetId: context.query.projectId});

        const thisProject = await ProjectModel.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(context.query.projectId)}},
            {$lookup: {from: "users", localField: "userId", foreignField: "_id", as: "ownerArr"}},
        ]);

        if (!thisProject) return {notFound: true};

        // subscription already exists
        if (thisSub) return {props: {email: decryptedEmail, emailHash: context.query.emailHash, projectData: cleanForJSON(thisProject[0]), exists: true}};

        // otherwise make the subscription
        await SubscriptionModel.create({
            targetType: "project",
            targetId: context.query.projectId,
            email: decryptedEmail,
        });

        return {props: {email: decryptedEmail, emailHash: context.query.emailHash, projectData: cleanForJSON(thisProject[0]), exists: false}};
    } catch (e) {
        return {notFound: true};
    }
}