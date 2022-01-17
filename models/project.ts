import mongoose, {Model} from "mongoose";
import {ProjectObj} from "../utils/types";

const ProjectSchema = new mongoose.Schema<ProjectObj>({
    userId: mongoose.Schema.Types.ObjectId,
    urlName: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: false},
}, {
    timestamps: true,
});

export const ProjectModel = (!!mongoose.models && mongoose.models.project as Model<ProjectObj>) || mongoose.model<ProjectObj>("project", ProjectSchema);