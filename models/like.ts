import mongoose, {Model} from "mongoose";

export interface LikeObj {
    nodeId: string,
    userId: string,
}

const LikeSchema = new mongoose.Schema({
    nodeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
}, {
    timestamps: true,
});

export const LikeModel = (!!mongoose.models && mongoose.models.like as Model<LikeObj>) || mongoose.model<LikeObj>("like", LikeSchema);