import {GetServerSideProps} from "next";
import mongoose from "mongoose";
import {UserModel} from "../../../../models/user";
import {ProjectModel} from "../../../../models/project";
import {cleanForJSON} from "../../../../utils/utils";
import {PostModel} from "../../../../models/post";
import {DatedObj, PostObj, ProjectObj, UserObj} from "../../../../utils/types";
import {useRouter} from "next/router";
import React, {useState} from "react";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import Parser from "html-react-parser";
import Link from "next/link";

export default function Project(props: {
    postData: DatedObj<PostObj>,
    projectData: DatedObj<ProjectObj>,
    thisUser: DatedObj<UserObj>
}) {
    const router = useRouter();
    const {_id: projectId, userId, name: projectName, description, urlName: projectUrlName} = props.projectData;
    const [body, setBody] = useState<string>(props.postData.body);
    const [title, setTitle] = useState<string>(props.postData.title);

    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });

    return (
        <div className="max-w-4xl mx-auto px-4 pb-16">
            <h1 className="up-h1">{title}</h1>
            <div className="flex my-8 items-center">
                <Link href={`/@${props.thisUser.username}`}>
                    <a>
                        <img src={props.thisUser.image} alt={`Profile picture of ${props.thisUser.name}`} className="w-10 h-10 rounded-full mr-4"/>
                    </a>
                </Link>
                <div>
                    <Link href={`/@${props.thisUser.username}`}>
                        <a className="font-bold">
                            {props.thisUser.name}
                        </a>
                    </Link>
                    <p className="opacity-50">
                        <span>In project: </span>
                        <Link href={`/@${props.thisUser.username}/${projectUrlName}`}>
                            <a className="underline">{projectName}</a>
                        </Link>
                    </p>
                </div>
            </div>
            <hr className="my-8"/>
            <div className="content prose">
                {Parser(markdownConverter.makeHtml(body))}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        Array.isArray(context.params.postUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;
    const postUrlName: string = context.params.postUrlName;

    // fetch project info from MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const thisUser = await UserModel.findOne({ username: username });

        if (!thisUser) return { notFound: true };

        const thisProject = await ProjectModel.findOne({ userId: thisUser._id, urlName: projectUrlName });

        if (!thisProject) return { notFound: true };

        const thisPost = await PostModel.findOne({ userId: thisUser._id, projectId: thisProject._id, urlName: encodeURIComponent(postUrlName) });

        if (!thisPost) return { notFound: true };
        
        return { props: { postData: cleanForJSON(thisPost), projectData: cleanForJSON(thisProject), thisUser: cleanForJSON(thisUser), key: postUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};