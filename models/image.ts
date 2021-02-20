import mongoose, {Document, Model} from "mongoose";
import {ImageObj} from "../utils/types";

const ImageSchema = new mongoose.Schema({
    key: {type: String, required: true},
    userId: mongoose.Schema.Types.ObjectId,
    projectId: mongoose.Schema.Types.ObjectId,
    attachedUrlName: {type: String, required: true},
    attachedType: {type: String, required: true},
    size: {type: Number, required: true},
}, {
    timestamps: true,
});

export const ImageModel: Model<Document<ImageObj>> = mongoose.models.image || mongoose.model("image", ImageSchema);