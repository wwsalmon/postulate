import mongoose, {Document, Model} from "mongoose";
import {PostObj, SnippetObj} from "../utils/types";

const PostSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    projectIds: [mongoose.Schema.Types.ObjectId],
    userId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    slateBody: {type: Object, required: false},
    tags: [{type: String, required: true}],
    privacy: {type: String, required: true}, // "public", "private", "unlisted", "draft"
}, {
    timestamps: true,
});

export const PostModel: Model<Document<PostObj>> = mongoose.models.post || mongoose.model("post", PostSchema);