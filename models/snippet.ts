import mongoose, {Document, Model} from "mongoose";
import {SnippetObj} from "../utils/types";

const SnippetSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    slateBody: {type: Object, required: true},
}, {
    timestamps: true,
});

export const SnippetModel: Model<Document<SnippetObj>> = mongoose.models.snippet || mongoose.model("snippet", SnippetSchema);