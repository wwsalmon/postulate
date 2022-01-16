import {GetServerSideProps} from "next";
import getPublicNodeSSRFunction, {PublicNodePageProps} from "../../../../utils/getPublicNodeSSRFunction";
import NodeShell from "../../../../components/project/NodeShell";

export default function PublicSourcePage(props: PublicNodePageProps) {
    return (
        <NodeShell {...props}/>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("source");