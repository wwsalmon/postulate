import {useSession} from "next-auth/client";
import axios from "axios";
import React, {useState} from "react";
import UpButton from "./UpButton";
import SpinnerButton from "./spinner-button";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import UpModal from "./up-modal";

export default function SubscriptionButton({projectId}: {projectId: string}) {
    const [session, loading] = useSession();
    const [subscribeOpen, setSubscribeOpen] = useState<boolean>(false);
    const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false);
    const [unsubscribeOpen, setUnsubscribeOpen] = useState<boolean>(false);
    const [unsubscribeLoading, setUnsubscribeLoading] = useState<boolean>(false);
    const [subscribeIter, setSubscribeIter] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [unauthedSubscribeLoading, setUnauthedSubscribeLoading] = useState<boolean>(false);
    const [subscribeDone, setSubscribeDone] = useState<boolean>(false);
    const [subscribeNew, setSubscribeNew] = useState<boolean>(false);

    const {data: subscribed, error: subscribedError}: responseInterface<{subscribed: boolean}, any> = useSWR(`/api/subscription?authed=true&projectId=${projectId}&iter=${subscribeIter}`, session ? fetcher : () => null);

    function onAuthedSubscribe() {
        setSubscribeLoading(true);

        axios.post(`/api/subscription?authed=true&projectId=${projectId}`).then(() => {
            setSubscribeIter(subscribeIter + 1);
            setSubscribeLoading(false);
        }).catch(e => {
            console.log(e);
            setSubscribeLoading(false);
        });
    }

    function onAuthedUnsubscribe() {
        setUnsubscribeLoading(true);

        axios.delete(`/api/subscription?authed=true&projectId=${projectId}`).then(() => {
            setSubscribeIter(subscribeIter + 1);
            setUnsubscribeLoading(false);
            setUnsubscribeOpen(false);
        }).catch(e => {
            console.log(e);
            setUnsubscribeLoading(false);
        });
    }

    function onUnauthedSubscribe() {
        setUnauthedSubscribeLoading(true);

        axios.post(`/api/subscription?email=${email}&projectId=${projectId}`).then(res => {
            if (!res.data.exists) setSubscribeNew(true);
            setSubscribeDone(true);
            setEmail("");
            setUnauthedSubscribeLoading(false);
        }).catch(e => {
            console.log(e);
            setUnauthedSubscribeLoading(false);
        });
    }

    return (
        <>
            {session ? (subscribed && subscribed.subscribed) ? (
                <UpButton text={true} onClick={() => setUnsubscribeOpen(true)}>
                    Unsubscribe
                </UpButton>
            ) : (
                <SpinnerButton onClick={onAuthedSubscribe} isLoading={subscribeLoading} className="small">
                    Subscribe
                </SpinnerButton>
            ) : (
                <UpButton primary={true} onClick={() => setSubscribeOpen(true)}>
                    Subscribe
                </UpButton>
            )}
            <UpModal isOpen={subscribeOpen} setIsOpen={setSubscribeOpen} wide={true}>
                {subscribeDone ? subscribeNew ? (
                    <>
                        <p>Check your email for a link to confirm your subscription.</p>
                        <UpButton className="mt-8 text" onClick={() => {
                            setSubscribeOpen(false);
                            setSubscribeDone(false);
                            setSubscribeNew(false);
                            setEmail("");
                        }}>Okay</UpButton>
                    </>
                ) : (
                    <>
                        <p>This email is already subscribed to this project.</p>
                        <UpButton className="mt-8 text" onClick={() => {
                            setSubscribeOpen(false);
                            setSubscribeDone(false);
                            setSubscribeNew(false);
                            setEmail("");
                        }}>Okay</UpButton>
                    </>
                ) : (
                    <>
                        <p>Subscribe to this project to get notified via email when a new post is published.</p>
                        <input
                            type="text"
                            className="border p-2 mt-4 w-full rounded-md"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className="flex mt-8">
                            <SpinnerButton
                                onClick={onUnauthedSubscribe}
                                isLoading={unauthedSubscribeLoading}
                                isDisabled={!email}
                            >
                                Subscribe
                            </SpinnerButton>
                            <UpButton text={true} className="ml-2" onClick={() => setSubscribeOpen(false)}>
                                Cancel
                            </UpButton>
                        </div>
                    </>
                )}
            </UpModal>
            <UpModal isOpen={unsubscribeOpen} setIsOpen={setUnsubscribeOpen} wide={true}>
                <p>Are you sure you want to unsubscribe from this project?</p>
                <div className="flex mt-8">
                    <SpinnerButton onClick={onAuthedUnsubscribe} isLoading={unsubscribeLoading}>
                        Unsubscribe
                    </SpinnerButton>
                    <UpButton text={true} className="ml-2" onClick={() => setUnsubscribeOpen(false)}>
                        Cancel
                    </UpButton>
                </div>
            </UpModal>
        </>
    );
}