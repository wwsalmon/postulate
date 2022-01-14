import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {useAutosave} from "react-autosave";
import SlateEditor from "../../slate/SlateEditor";
import {Node} from "slate";

export default function AutosavingEditor({prevValue, onSubmitEdit, setStatus}: {prevValue: Node[], onSubmitEdit: (value: Node[]) => Promise<any>, setStatus?: Dispatch<SetStateAction<string>>}) {
    const [value, setValue] = useState<Node[]>(prevValue);
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
            <SlateEditor value={value} setValue={setValue}/>
            <p className="text-sm mt-3">{getStatus(isLoading, value, prevValue)}</p>
        </>
    )
}

const getStatus = (isLoading: boolean, value: Node[], prevValue: Node[]) => isLoading ? "Saving..." : JSON.stringify(value) === JSON.stringify(prevValue) ? "Saved" : "Unsaved changes"