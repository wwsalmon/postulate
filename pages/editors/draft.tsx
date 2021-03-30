import React, {useRef, useState} from 'react';
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

export default function Draft() {
    const draftEditor = useRef(null);
    const [draftEditorState, setDraftEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="content prose">
                <Editor
                    ref={draftEditor}
                    editorState={draftEditorState}
                    onChange={setDraftEditorState}
                    placeholder="Write something!"
                />
            </div>
            <button onClick={() => console.log(draftEditorState.getCurrentContent().getBlocksAsArray().map(d => ({text: d.getText(), type: d.getType(), data: d.getData()})))}>console log</button>
        </div>
    );
}