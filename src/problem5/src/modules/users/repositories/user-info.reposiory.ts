import { injectable } from 'inversify';
import { BaseRepository } from '../../../shared/repositories/ibase.repository';
import { UserInfoCollection, UserInfoModel } from '../models/user-info.model';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

@injectable()
export class UserInfoRepository extends BaseRepository<UserInfoCollection> {
    constructor() {
        super(UserInfoModel);
    }
    async createUserInfo(
        userId: Types.ObjectId,
        sessionId?: string,
    ): Promise<UserInfoCollection> {
        const userInfo = new this.model({
            userId,
            sessionId: sessionId ?? uuidv4(),
            secretKey: crypto.randomBytes(32).toString('hex'),
        });
        return await userInfo.save();
    }
    async findBySessionId(
        sessionId: string,
    ): Promise<UserInfoCollection | null> {
        return this.model.findOne({ sessionId }).exec();
    }

    async findByUserId(userId: string): Promise<UserInfoCollection[]> {
        return this.model.find({ userId }).exec();
    }

    async updateSecretKey(
        userInfoId: string,
        newKey: string,
    ): Promise<UserInfoCollection | null> {
        return this.model
            .findByIdAndUpdate(userInfoId, { secretKey: newKey }, { new: true })
            .exec();
    }

    async deleteBySessionId(sessionId: string): Promise<void> {
        await this.model.deleteOne({ sessionId }).exec();
    }
}
