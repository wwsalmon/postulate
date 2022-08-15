import mongoose, {Model} from "mongoose";

export interface CommentObj {
    nodeId: string,
    userId: string,
    body: string,
    parentId?: string,
}

const CommentSchema = new mongoose.Schema({
    nodeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    body: {type: String, required: true},
    parentId: {type: mongoose.Schema.Types.ObjectId, required: false},
}, {
    timestamps: true,
});

export const CommentModel = (!!mongoose.models && mongoose.models.comment as Model<CommentObj>) || mongoose.model<CommentObj>("comment", CommentSchema);