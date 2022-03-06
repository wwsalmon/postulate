import {NodeObjPublic, ProjectObj, UserObj} from "./types";
import getProjectUrl from "./getProjectUrl";

const getNodeUrl = (
    user: UserObj,
    project: ProjectObj,
    node: NodeObjPublic
) => `${getProjectUrl(user, project)}/${node.type.charAt(0)}/${node.body.urlName}`;

export default getNodeUrl;