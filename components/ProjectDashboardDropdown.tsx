import {FiChevronDown} from "react-icons/fi";
import MoreMenuItem from "./more-menu-item";

export default function ProjectDashboardDropdown({projectId, className}: {projectId: string, className?: string}) {
    return (
        <button className={`up-hover-button relative h-8 px-2 ${className || ""}`}>
            <FiChevronDown className="text-sm cursor-pointer up-gray-300"/>
            <div className="up-hover-dropdown mt-8">
                <MoreMenuItem text="Project dashboard" href={`/projects/${projectId}`}/>
            </div>
        </button>
    );
}