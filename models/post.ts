import mongoose, {Document, Model} from "mongoose";
import {PostObj, SnippetObj} from "../utils/types";

const PostSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    body: {type: String, required: true},
    tags: [{type: String, required: true}],
    likes: [mongoose.Schema.Types.ObjectId],
}, {
    timestamps: true,
});

export const PostModel: Model<Document<PostObj>> = mongoose.models.post || mongoose.model("post", PostSchema);