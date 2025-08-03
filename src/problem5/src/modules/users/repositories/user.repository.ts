/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import { BaseRepository } from '../../../shared/repositories/ibase.repository';
import { UserCollection, UserModel } from '../models/user.model';

@injectable()
export class UserRepository extends BaseRepository<UserCollection> {
    constructor() {
        super(UserModel);
    }
    async findByName(name: string): Promise<UserCollection | null> {
        return this.model.findOne({ name }).exec();
    }
    toSafeUser(user: UserCollection): Record<string, any> {
        const { _id, fullName, userName, createdAt, updatedAt } = user;
        return {
            id: _id,
            fullName,
            userName,
            createdAt,
            updatedAt,
        };
    }
}
