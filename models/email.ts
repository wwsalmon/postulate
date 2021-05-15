import mongoose, {Document, Model} from "mongoose";
import {EmailObj} from "../utils/types";

const EmailSchema = new mongoose.Schema({
    targetId: mongoose.Schema.Types.ObjectId,
    recipients: [{ required: true, type: String }],
}, {
    timestamps: true,
});

export const EmailModel: Model<Document<EmailObj>> = mongoose.models.email || mongoose.model("email", EmailSchema);