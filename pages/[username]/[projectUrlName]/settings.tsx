import Container from "../../../components/style/Container";
import H1 from "../../../components/style/H1";
import {ProjectFields} from "../../new/project";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import {ProjectPageProps} from "../../../utils/getPublicNodeSSRFunction";
import SEO from "../../../components/standard/SEO";

export default function ProjectSettings(props: ProjectPageProps) {
    return (
        <Container className="max-w-2xl">
            <SEO title={`Project settings for ${props.pageProject.name}`}/>
            <H1>Settings</H1>
            <ProjectFields {...props}/>
        </Container>
    );
}

export const getServerSideProps = getProjectSSRFunction();