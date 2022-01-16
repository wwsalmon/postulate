import mongoose, {Document, Model} from "mongoose";
import {ShortcutObj} from "../utils/types";

const ShortcutSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    targetId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    type: {type: String, required: true},
}, {
    timestamps: true,
});

export const ShortcutModel: Model<Document<ShortcutObj>> = (!!mongoose.models && mongoose.models.shortcut) || mongoose.model("shortcut", ShortcutSchema);