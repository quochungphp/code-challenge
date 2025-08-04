import { injectable, inject } from 'inversify';
import { TYPES } from '../../../bootstrap-type';
import { UserRepository } from '../repositories/user.repository';

@injectable()
export class UserDeleteHandler {
    constructor(
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository,
    ) {}

    public async deleteAsync(userId: string): Promise<{ deleted: boolean }> {
        const result = await this.userRepository.model
            .findByIdAndDelete(userId)
            .exec();
        return { deleted: !!result };
    }
}
