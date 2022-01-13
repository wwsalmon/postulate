import {ProjectObj, UserObj} from "./types";

const getProjectUrl = (user: UserObj, project: ProjectObj) => `/@${user.username}/${project.urlName}`;

export default getProjectUrl;