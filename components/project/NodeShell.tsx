import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import SEO from "../standard/SEO";
import PublicNavbar from "./PublicNavbar";
import NodeInner from "./NodeInner";
import Container from "../style/Container";

export default function NodeShell(props: PublicNodePageProps) {
    const {pageNode, pageUser, pageProject} = props;

    const nodeType = pageNode.type;
    const isPost = nodeType === "post";
    const isSource = nodeType === "source";

    return (
        <>
            <SEO title={pageNode.body.publishedTitle || `Untitled ${nodeType}`}/>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
            <Container>
                <div
                    className={isPost ? "pt-8 pb-32 mx-auto" : isSource ? "my-8 mx-auto" : "p-8 border border-gray-300 rounded-md my-8 mx-auto"}
                    style={{maxWidth: "78ch"}} // 78ch bc font size is 16 here but we want 65ch for font size 20
                >
                    <NodeInner {...props}/>
                </div>
            </Container>
        </>
    )
}