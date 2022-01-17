import mongoose, {Model} from "mongoose";
import {NodeObj} from "../utils/types";

const NodeSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    body: {type: Object, required: true},
    type: {type: String, required: true},
}, {
    timestamps: true,
});

export const NodeModel = (!!mongoose.models && mongoose.models.node as Model<NodeObj>) || mongoose.model<NodeObj>("node", NodeSchema);