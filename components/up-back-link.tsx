import Link from "next/link";
import {FiArrowLeft} from "react-icons/fi";

export default function UpBackLink({link, text, className = ""}: {link: string, text: string, className?: string}) {
    return (
        <Link href={link}>
            <a className={"flex items-center " + className}>
                <FiArrowLeft/>
                <span className="ml-2">Back to {text}</span>
            </a>
        </Link>
    );
}