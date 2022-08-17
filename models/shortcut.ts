import mongoose, {Model} from "mongoose";
import {ShortcutObj} from "../utils/types";

const ShortcutSchema = new mongoose.Schema<ShortcutObj>({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    targetId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    type: {type: String, required: true},
}, {
    timestamps: true,
});

export const ShortcutModel = (!!mongoose.models && mongoose.models.shortcut as Model<ShortcutObj>) || mongoose.model<ShortcutObj>("shortcut", ShortcutSchema);