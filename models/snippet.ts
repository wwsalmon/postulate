import mongoose, {Model} from "mongoose";
import {SnippetObj} from "../utils/types";

const SnippetSchema = new mongoose.Schema<SnippetObj>({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    slateBody: {type: Object, required: true},
}, {
    timestamps: true,
});

export const SnippetModel = mongoose.models.snippet as Model<SnippetObj> || mongoose.model<SnippetObj>("snippet", SnippetSchema);