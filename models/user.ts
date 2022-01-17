import mongoose, {Model} from "mongoose";
import {UserObj} from "../utils/types";

const UserSchema = new mongoose.Schema<UserObj>({
    email: {type: String, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    image: {type: String, required: true},
    bio: {type: String, required: false},
    featuredProjects: [mongoose.Schema.Types.ObjectId],
}, {
    timestamps: true,
});

export const UserModel = (!!mongoose.models && mongoose.models.user as Model<UserObj>) || mongoose.model<UserObj>("user", UserSchema);