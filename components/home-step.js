export default function HomeStep({number, title, children}) {
    return (
        <div className="flex my-16">
            <div className="w-10 h-10 rounded-full bg-gray-100 font-bold mr-6 flex items-center justify-center">
                <span>{number}</span>
            </div>
            <div className="w-full">
                <p className="text-2xl up-font-display mt-1 mb-4">{title}</p>
                {children}
            </div>
        </div>
    )
}