import mongoose, {Document, Model} from "mongoose";
import {ProjectObj} from "../utils/types";

const ProjectSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: false},
    stars: [mongoose.Schema.Types.ObjectId],
    collaborators: [mongoose.Schema.Types.ObjectId],
    availableTags: [{type: String, required: true}],
}, {
    timestamps: true,
});

export const ProjectModel: Model<Document<ProjectObj>> = (!!mongoose.models && mongoose.models.project) || mongoose.model("project", ProjectSchema);