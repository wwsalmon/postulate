import {useCallback, useState} from "react";
import Button from "./Button";
import {getInputStateProps} from "react-controlled-component-helpers";
import {useAutosave} from "react-autosave";

export default function ClickableField({prevValue, onSubmitEdit, placeholder, className}: {prevValue: string, onSubmitEdit: (value: string) => Promise<any>, placeholder?: string, className?: string}) {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [value, setValue] = useState<string>(prevValue);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useAutosave({data: value, onSave: useCallback((value) => {
        if (!isLoading) {
        setIsLoading(true);

        onSubmitEdit(value).then(() => setIsLoading(false));
    }}, []), interval: 1000});

    return isEdit ? (
        <>
            <input
                className={className || ""} {...getInputStateProps(value, setValue)}
                onKeyDown={e => {
                    if (e.key === "Escape") {
                        setValue(prevValue);
                        return setIsEdit(false);
                    }
                    if (e.key === "Enter") {
                        setIsEdit(false);
                        if (value === prevValue) return;
                        setIsLoading(true);
                        onSubmitEdit(value).then(() => setIsLoading(false));
                    }
                }}
                autoFocus={true}
                onBlur={() => {
                    setValue(prevValue);
                    return setIsEdit(false);
                }}
            />
            <p className="text-sm mt-3">{isLoading ? "Saving..." : value === prevValue ? "Saved" : "Unsaved changes"}</p>
        </>
    ) : (
        <Button
            className={`${className || ""} hover:bg-gray-200 transition text-left`}
            onClick={() => setIsEdit(true)}
        >
            <span>{prevValue || <span className="text-gray-500">{placeholder || "Untitled"}</span>}</span>
        </Button>
    )
}