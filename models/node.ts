import mongoose, {Document, Model} from "mongoose";

const NodeSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    projectIds: [mongoose.Schema.Types.ObjectId],
    userId: mongoose.Schema.Types.ObjectId,
    legacyUrlName: {type: String, required: false},
    title: {type: String, required: false},
    body: {type: Object, required: false},
    tags: [{type: String, required: true}],
    privacy: {type: String, required: true}, // "public", "private", "unlisted", "draft"
}, {
    timestamps: true,
});

export const NodeModel: Model<Document<NodeObj>> = mongoose.models.post || mongoose.model("node", NodeSchema);