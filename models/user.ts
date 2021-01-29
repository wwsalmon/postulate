import mongoose, {Model, Document} from "mongoose";
import {UserObj} from "../utils/types";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    bio: {type: String, required: false},
}, {
    timestamps: true,
});

export const UserModel: Model<Document<UserObj>> = mongoose.models.user || mongoose.model("user", UserSchema);