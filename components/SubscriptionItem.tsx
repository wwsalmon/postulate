import {DatedObj, SubscriptionObjGraph} from "../utils/types";
import {Dispatch, SetStateAction, useState} from "react";
import axios from "axios";
import Link from "next/link";
import UpButton from "./UpButton";
import UpModal from "./up-modal";
import SpinnerButton from "./spinner-button";

export default function SubscriptionItem({subscription, setIter, iter, emailHash, i}: {
    subscription: DatedObj<SubscriptionObjGraph>,
    setIter: Dispatch<SetStateAction<number>>,
    iter: number,
    emailHash: string,
    i: number,
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function onUnsubscribe() {
        setIsLoading(true);
        axios.delete(`/api/subscription?emailHash=${encodeURIComponent(emailHash)}&projectId=${subscription.targetId}`).then(() => {
            setIsModalOpen(false);
            setIsLoading(false);
            setIter(iter + 1);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <div className={`py-4 hover:up-bg-gray-50 flex items-center ${i !== 0 ? "border-t" : ""}`}>
            <Link href={`/@${subscription.projectArr[0].ownerArr[0].username}/${subscription.projectArr[0].urlName}`}>
                <a>
                    <p>{subscription.projectArr[0].ownerArr[0].name} / {subscription.projectArr[0].name}</p>
                </a>
            </Link>
            <UpButton text={true} small={true} onClick={() => setIsModalOpen(true)} className="ml-auto">Unsubscribe</UpButton>
            <UpModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
                <p>Are you sure you want to unsubscribe from this project?</p>
                <div className="flex mt-4">
                    <SpinnerButton onClick={onUnsubscribe} isLoading={isLoading}>Unsubscribe</SpinnerButton>
                    <UpButton text={true} onClick={() => setIsModalOpen(false)}>Cancel</UpButton>
                </div>
            </UpModal>
        </div>
    );
}