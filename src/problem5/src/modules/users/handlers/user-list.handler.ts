import { injectable, inject } from 'inversify';
import { TYPES } from '../../../bootstrap-type';
import { UserRepository } from '../repositories/user.repository';
import { GetUsersQueryDto } from '../types/user.dto';

@injectable()
export class UserListHandler {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
    ) {}

    public async execute(query: GetUsersQueryDto) {
        const { page, limit, userName, fullName } = query;
        const filters: Record<string, unknown> = {};

        if (userName) filters.userName = { $regex: userName, $options: 'i' };
        if (fullName) filters.fullName = { $regex: fullName, $options: 'i' };

        const skip = (page - 1) * limit;
        // TODO: apply cache first based on query

        const [total, users] = await Promise.all([
            this.userRepository.model.countDocuments(filters),
            this.userRepository.model.find(filters).skip(skip).limit(limit),
        ]);

        return {
            total,
            page,
            limit,
            items: users.map((u) => this.userRepository.toSafeUser(u)),
        };
    }
}
