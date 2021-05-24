import mongoose, {Document, Model} from "mongoose";
import {LinkObj} from "../utils/types";

const LinkSchema = new mongoose.Schema({
    nodeType: { required: true, type: String },
    nodeId: mongoose.Schema.Types.ObjectId,
    targetType: { required: true, type: String },
    targetId: { required: false, type: mongoose.Schema.Types.ObjectId },
    targetUrl: { required: false, type: String },
}, {
    timestamps: true,
});

export const LinkModel: Model<Document<LinkObj>> = mongoose.models.link || mongoose.model("link", LinkSchema);