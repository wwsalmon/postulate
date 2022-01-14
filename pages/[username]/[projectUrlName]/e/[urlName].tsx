import {GetServerSideProps} from "next";
import SEO from "../../../../components/standard/SEO";
import {getPublicNodeSSRFunction, PublicNodePageProps} from "../p/[urlName]";
import EvergreenInner from "../../../../components/project/EvergreenInner";
import PublicNavbar from "../../../../components/project/PublicNavbar";

export default function PublicEvergreenPage(props: PublicNodePageProps) {
    const {pageNode, pageUser, pageProject} = props;

    return (
        <div className="p-8 border border-gray-300 rounded-md my-8 mx-auto" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
            <SEO title={pageNode.body.publishedTitle || `Untitled post`}/>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
            <EvergreenInner {...props}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("evergreen");