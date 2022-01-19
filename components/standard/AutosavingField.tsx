import {Dispatch, SetStateAction, useCallback, useEffect, useState, HTMLProps} from "react";
import {useAutosave} from "react-autosave";
import {Node} from "slate";
import {getStatus} from "./AutosavingEditor";
import {getInputStateProps} from "react-controlled-component-helpers";

export default function AutosavingField({prevValue, onSubmitEdit, setStatus, ...domProps}: HTMLProps<HTMLInputElement> & {
    prevValue: string,
    onSubmitEdit: (value: string) => Promise<any>,
    setStatus?: Dispatch<SetStateAction<string>>,
}) {
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

    return (
        <>
            <input type="text" {...domProps} {...getInputStateProps(value, setValue)}/>
            <p className="text-sm mt-3">{getStatus(isLoading, value, prevValue)}</p>
        </>
    )
}