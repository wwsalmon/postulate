import {GetServerSideProps} from "next";
import {ssr404, ssrRedirect} from "next-response-helpers";
import getThisUser from "../../utils/getThisUser";
import {cleanForJSON} from "../../utils/utils";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";
import Container from "../../components/style/Container";
import H1 from "../../components/style/H1";
import {Dispatch, SetStateAction, useState} from "react";
import UiButton from "../../components/style/UiButton";
import {getInputStateProps} from "react-controlled-component-helpers";
import UiH3 from "../../components/style/UiH3";
import axios from "axios";
import getProjectUrl from "../../utils/getProjectUrl";
import {useRouter} from "next/router";
import SEO from "../../components/standard/SEO";

export function Field({value, setValue, placeholder}: {value: string, setValue: Dispatch<SetStateAction<string>>, placeholder: string}) {
    return (
        <input
            type="text"
            className="p-2 my-2 border rounded-md border-gray-300 block w-full"
            placeholder={placeholder}
            {...getInputStateProps(value, setValue)}
        />
    )
}

export function ProjectFields({thisUser, pageProject}: {thisUser: DatedObj<UserObj>, pageProject?: DatedObj<ProjectObj>}) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(pageProject ? pageProject.name : "");
    const [description, setDescription] = useState<string>(pageProject ? pageProject.description : "");
    const [urlName, setUrlName] = useState<string>(pageProject ? pageProject.urlName : "");
    const [urlNameError, setUrlNameError] = useState<boolean>(false);

    const isDisabled = urlNameError || !(urlName && name);

    function onSubmit() {
        if (isDisabled) return;

        setIsLoading(true);

        let data = {name, description, urlName};

        if (pageProject) data["id"] = pageProject._id;

        axios.post("/api/project", data).then((res) => {
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
        <>
            <UiH3 className="mt-8">Repository name</UiH3>
            <Field value={name} setValue={setName} placeholder="Repository name"/>
            <UiH3 className="mt-8">Description</UiH3>
            <p className="text-gray-400">Publicly visible. You can change this later.</p>
            <Field value={description} setValue={setDescription} placeholder="Description"/>
            <UiH3 className="mt-8">URL name</UiH3>
            <p className="text-gray-400 my-2">The URL that your repository will be publicly accessible at. You can change this later but this will cause post links to break.</p>
            <div className="flex items-center">
                <p className="mr-2 text-gray-500">postulate.us/@{thisUser.username}/</p>
                <Field value={urlName} setValue={(value: string) => {
                    setUrlName(value);
                    setUrlNameError(false);
                }} placeholder="URL name"/>
            </div>
            {urlNameError && (
                <p className="my-2 text-red-500">You have another repository with this URL name already.</p>
            )}
            {pageProject && urlName !== pageProject.urlName && (
                <p className="my-2 text-yellow-500">Warning: changing the urlName will break existing post, evergreen, and source links</p>
            )}
            <UiButton className="mt-8" onClick={onSubmit} isLoading={isLoading} disabled={isDisabled}>{pageProject ? "Save" : "Create"}</UiButton>
        </>
    );
}

export default function NewProject(props: {thisUser: DatedObj<UserObj>}) {
    return (
        <Container className="max-w-2xl">
            <SEO title="New repository"/>
            <H1>New repository</H1>
            <ProjectFields {...props}/>
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