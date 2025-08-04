import { injectable, inject } from 'inversify';
import { TYPES } from '../../../bootstrap-type';
import { UserRepository } from '../repositories/user.repository';

@injectable()
export class UserInfoHandler {
    constructor(
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository,
    ) {}

    public async getByIdAsync(userId: string) {
        const user = await this.userRepository.model.findById(userId).exec();
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }
        return this.userRepository.toSafeUser(user);
    }
}
