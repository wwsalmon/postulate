import mongoose, {Document, Model} from "mongoose";
import {SubscriptionObj} from "../utils/types";

const SubscriptionSchema = new mongoose.Schema({
    targetType: { required: true, type: String },
    targetId: { required: true, type: mongoose.Schema.Types.ObjectId },
    email: { required: true, type: String },
}, {
    timestamps: true,
});

export const SubscriptionModel: Model<Document<SubscriptionObj>> = mongoose.models.subscription ||   mongoose.model("subscription", SubscriptionSchema);