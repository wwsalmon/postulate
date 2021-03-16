import mongoose, {Document, Model} from "mongoose";
import {NotificationObj} from "../utils/types";

const NotificationSchema = new mongoose.Schema({
    targetId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    type: { required: true, type: String },
    read: { required: true, type: Boolean },
}, {
    timestamps: true,
});

export const NotificationModel: Model<Document<NotificationObj>> = mongoose.models.notification || mongoose.model("notification", NotificationSchema);