import mongoose, {Model} from "mongoose";
import {PostObj} from "../utils/types";

const ShortcutSchema = new mongoose.Schema<PostObj>({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    targetId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    type: {type: String, required: true},
}, {
    timestamps: true,
});

export const ShortcutModel = (!!mongoose.models && mongoose.models.shortcut as Model<PostObj>) || mongoose.model<PostObj>("shortcut", ShortcutSchema);