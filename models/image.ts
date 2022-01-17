import mongoose, {Model} from "mongoose";
import {ImageObj} from "../utils/types";

const ImageSchema = new mongoose.Schema<ImageObj>({
    key: {type: String, required: true},
    userId: mongoose.Schema.Types.ObjectId,
    size: {type: Number, required: true},
}, {
    timestamps: true,
});

export const ImageModel = mongoose.models.image as Model<ImageObj> || mongoose.model<ImageObj>("image", ImageSchema);