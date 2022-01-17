import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import Button from "../headless/Button";
import {getInputStateProps} from "react-controlled-component-helpers";
import {useAutosave} from "react-autosave";
import {getStatus} from "./AutosavingEditor";

export default function ClickableAutosavingField({prevValue, onSubmitEdit, placeholder, className, inputClassName, buttonClassname, setStatus}: {
    prevValue: string,
    onSubmitEdit: (value: string) => Promise<any>,
    placeholder?: string,
    className?: string,
    inputClassName?: string,
    buttonClassname?: string,
    setStatus?: Dispatch<SetStateAction<string>>,
}) {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [value, setValue] = useState<string>(prevValue);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setStatus(getStatus(isLoading, value, prevValue));
    }, [value, prevValue, isLoading]);

    useAutosave({
        data: value, onSave: useCallback((value) => {
            if (!isLoading) {
                setIsLoading(true);

                onSubmitEdit(value).then(() => setIsLoading(false));
            }
        }, []), interval: 1000
    });

    return isEdit ? (
        <>
            <input
                className={`${className || ""} ${inputClassName || ""}`} {...getInputStateProps(value, setValue)}
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
            className={`${className || ""} ${buttonClassname || ""} hover:bg-gray-100 transition text-left`}
            onClick={() => setIsEdit(true)}
        >
            <span>{prevValue || <span className="text-gray-500">{placeholder || "Untitled"}</span>}</span>
        </Button>
    );
}