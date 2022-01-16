import {GetServerSideProps} from "next";
import SEO from "../../../../components/standard/SEO";
import PublicNavbar from "../../../../components/project/PublicNavbar";
import NodeInner from "../../../../components/project/NodeInner";
import getPublicNodeSSRFunction, {PublicNodePageProps} from "../../../../utils/getPublicNodeSSRFunction";

export default function PublicSourcePage(props: PublicNodePageProps) {
    const {pageNode, pageUser, pageProject} = props;

    return (
        <div className="my-8 mx-auto px-4" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
            <SEO title={pageNode.body.publishedTitle || `Untitled source`}/>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
            <NodeInner {...props}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("source");