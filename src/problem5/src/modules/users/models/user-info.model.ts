import mongoose, { Schema, Document, Types } from 'mongoose';
import crypto from 'crypto';
import { UserCollection } from './user.model'; // adjust path as needed

export interface UserInfoCollection extends Document {
    userId: Types.ObjectId | UserCollection;
    sessionId: string;
    secretKey: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserInfoSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
        },
        secretKey: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

UserInfoSchema.pre<UserInfoCollection>('save', function (next) {
    if (!this.secretKey) {
        this.secretKey = crypto.randomBytes(32).toString('hex'); // 64-char secret
    }
    next();
});

export const UserInfoModel = mongoose.model<UserInfoCollection>('UserInfo', UserInfoSchema);
