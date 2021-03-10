import mongoose, {Document, Model} from "mongoose";
import {TagObj} from "../utils/types";

const TagSchema = new mongoose.Schema({
    key: { type: String, required: true },
});

export const TagModel: Model<Document<TagObj>> = mongoose.models.tag || mongoose.model("tag", TagSchema);