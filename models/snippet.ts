import mongoose, {Document, Model} from "mongoose";
import {SnippetObj} from "../utils/types";

const SnippetSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    type: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: String, required: true},
    url: {type: String, required: true},
    tags: [{type: String, required: true}],
    likes: [mongoose.Schema.Types.ObjectId],
}, {
    timestamps: true,
});

export const SnippetModel: Model<Document<SnippetObj>> = mongoose.models.snippet || mongoose.model("snippet", SnippetSchema);