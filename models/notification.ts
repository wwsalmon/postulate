import mongoose, {Model, Schema} from "mongoose";

export interface NotificationObj {
    nodeId: string,
    userId: string,
    authorId: string,
    itemId: string,
    read: boolean,
}

const NotificationSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId, // ID of receiving user
    authorId: mongoose.Schema.Types.ObjectId, // ID of comment author
    nodeId: mongoose.Schema.Types.ObjectId, // ID of update of comment to generate link and notification message
    itemId: {type: mongoose.Schema.Types.ObjectId, required: false}, // ID of the comment for likeComment
    read: {type: Boolean, required: true},
}, {
    timestamps: true,
});

export const NotificationModel = (!!mongoose.models && mongoose.models.notification as Model<NotificationObj>) || mongoose.model<NotificationObj>("notification", NotificationSchema);