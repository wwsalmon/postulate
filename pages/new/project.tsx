import {GetServerSideProps} from "next";
import {ssr404, ssrRedirect} from "next-response-helpers";
import getThisUser from "../../utils/getThisUser";
import {cleanForJSON} from "../../utils/utils";
import {DatedObj, UserObj} from "../../utils/types";
import Container from "../../components/style/Container";
import H1 from "../../components/style/H1";
import {Dispatch, SetStateAction, useState} from "react";
import UiButton from "../../components/style/UiButton";
import {getInputStateProps} from "react-controlled-component-helpers";
import UiH3 from "../../components/style/UiH3";
import axios from "axios";
import getProjectUrl from "../../utils/getProjectUrl";
import {useRouter} from "next/router";

function Field({value, setValue, placeholder}: {value: string, setValue: Dispatch<SetStateAction<string>>, placeholder: string}) {
    return (
        <input
            type="text"
            className="p-2 my-2 border rounded-md border-gray-300 block w-full"
            placeholder={placeholder}
            {...getInputStateProps(value, setValue)}
        />
    )
}

export default function NewProject({thisUser}: {thisUser: DatedObj<UserObj>}) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [urlName, setUrlName] = useState<string>("");
    const [urlNameError, setUrlNameError] = useState<boolean>(false);

    const isDisabled = urlNameError || !(urlName && name);

    function onSubmit() {
        if (isDisabled) return;

        setIsLoading(true);

        axios.post("/api/project", {name, description, urlName}).then((res) => {
            if (res.data.error) {
                setUrlNameError(true);
                setIsLoading(false);
                return;
            }
            const {data: {project}} = res;
            router.push(getProjectUrl(thisUser, project));
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    return (
        <Container className="max-w-2xl">
            <H1>New project</H1>
            <UiH3 className="mt-8">Project name</UiH3>
            <Field value={name} setValue={setName} placeholder="Project name"/>
            <UiH3 className="mt-8">Description</UiH3>
            <p className="text-gray-400">Publicly visible. You can change this later.</p>
            <Field value={description} setValue={setDescription} placeholder="Description"/>
            <UiH3 className="mt-8">URL name</UiH3>
            <p className="text-gray-400 my-2">The URL that your project will be publicly accessible at. You can change this later but this will cause post links to break.</p>
            <div className="flex items-center">
                <p className="mr-2 text-gray-500">postulate.us/@{thisUser.username}/</p>
                <Field value={urlName} setValue={(value: string) => {
                    setUrlName(value);
                    setUrlNameError(false);
                }} placeholder="URL name"/>
            </div>
            {urlNameError && (
                <p className="my-2 text-red-500">You have another project with this URL name already.</p>
            )}
            <UiButton className="mt-8" onClick={onSubmit} isLoading={isLoading} disabled={isDisabled}>Create</UiButton>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const thisUser = await getThisUser(context);
        if (!thisUser) return ssrRedirect("/auth/signin");
        return {props: cleanForJSON({thisUser})};
    } catch (e) {
        console.log(e);
        return ssr404;
    }
}