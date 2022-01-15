import mongoose, {Document, Model} from "mongoose";
import {SnippetObj} from "../utils/types";

const SnippetSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: false}, // legacy
    type: {type: String, required: false}, // legacy
    body: {type: String, required: false}, // legacy
    slateBody: {type: Object, required: false},
    date: {type: String, required: false}, // legacy
    url: {type: String, required: false}, // legacy
    tags: [{type: String, required: true}], // legacy
    linkedPosts: [mongoose.Schema.Types.ObjectId], // legacy
    privacy: {type: String, required: false}, // legacy
}, {
    timestamps: true,
});

export const SnippetModel: Model<Document<SnippetObj>> = mongoose.models.snippet || mongoose.model("snippet", SnippetSchema);