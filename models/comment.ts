import mongoose, {Document, Model} from "mongoose";
import {CommentObj, ReactionObj} from "../utils/types";

const CommentSchema = new mongoose.Schema({
    targetId: mongoose.Schema.Types.ObjectId,
    parentCommentId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    body: { required: true, type: String },
}, {
    timestamps: true,
});

export const CommentModel: Model<Document<CommentObj>> = mongoose.models.comment || mongoose.model("comment", CommentSchema);