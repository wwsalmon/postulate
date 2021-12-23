import {GetServerSideProps} from "next";
import React from "react";
import Container from "../../../components/style/Container";

export default function SnippetRedirect() {
    return (
        <Container>
            <p>to be built</p>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.snippetId) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const snippetId: string = context.params.snippetId;
    return { props: { }};
};