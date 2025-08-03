import mongoose, { Schema, Document } from 'mongoose';
export interface UserCollection extends Document {
    fullName: string;
    userName: string;
    password: string;
    passwordSecret: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (candidate: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        passwordSecret: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<UserCollection>('User', UserSchema);
