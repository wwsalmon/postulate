export const slateLoadingComponent = props => (
    <div className="bg-gray-100 text-xs text-gray-500 w-full h-24 my-4 rounded-md relative" contentEditable={false}>
        <div className="up-spinner dark"/>
        {props.children}
    </div>
);