import {useCallback, useState} from "react";
import {useAutosave} from "react-autosave";
import SlateEditor from "../../slate/SlateEditor";
import {Node} from "slate";

export default function AutosavingEditor({prevValue, onSubmitEdit, className}: {prevValue: Node[], onSubmitEdit: (value: Node[]) => Promise<any>, className?: string}) {
    const [value, setValue] = useState<Node[]>(prevValue);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            <p className="text-sm mt-3">{isLoading ? "Saving..." : JSON.stringify(value) === JSON.stringify(prevValue) ? "Saved" : "Unsaved changes"}</p>
        </>
    )
}