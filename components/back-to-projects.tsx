import Link from "next/link";
import {FiArrowLeft} from "react-icons/fi";

export default function BackToProjects() {
    return (
        <Link href="/projects">
            <a className="flex items-center">
                <FiArrowLeft/>
                <span className="ml-2">Back to all projects</span>
            </a>
        </Link>
    );
}