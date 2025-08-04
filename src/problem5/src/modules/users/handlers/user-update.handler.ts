import { injectable, inject } from 'inversify';
import { TYPES } from '../../../bootstrap-type';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto, UpdateUserSchema } from '../types/user.dto';
import { ZodError } from 'zod';

@injectable()
export class UserUpdateHandler {
    constructor(
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository,
    ) {}

    public async updateAsync(
        userId: string,
        input: unknown,
    ): Promise<UpdateUserDto> {
        let data: UpdateUserDto;
        try {
            data = await UpdateUserSchema.parseAsync(input);
        } catch (err) {
            if (err instanceof ZodError) {
                throw {
                    status: 400,
                    message: 'Validation failed',
                    errors: err.errors,
                };
            }
            throw err;
        }

        const updated = await this.userRepository.model
            .findByIdAndUpdate(userId, data, { new: true })
            .exec();

        if (!updated) {
            throw { status: 404, message: 'User not found' };
        }

        return this.userRepository.toSafeUser(updated);
    }
}
