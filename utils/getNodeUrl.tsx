import {DatedObj, NodeObj, ProjectObj, UserObj} from "./types";
import getProjectUrl from "./getProjectUrl";

const getNodeUrl = (
    user: UserObj,
    project: ProjectObj,
    node: DatedObj<NodeObj>,
) => {
    const nodeUrlSection = "urlName" in node.body ? `${node.type.charAt(0)}/${node.body.urlName}` : `node/${node._id}`;

    return `${getProjectUrl(user, project)}/${nodeUrlSection}`;
}

export default getNodeUrl;