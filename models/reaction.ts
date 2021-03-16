import mongoose, {Document, Model} from "mongoose";
import {ReactionObj} from "../utils/types";

const ReactionSchema = new mongoose.Schema({
    targetId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
}, {
    timestamps: true,
});

export const ReactionModel: Model<Document<ReactionObj>> = mongoose.models.reaction || mongoose.model("reaction", ReactionSchema);