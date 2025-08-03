 
 
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../bootstrap-type';
import { UserRepository } from '../repositories/user.repository';
import { ConfigEnv } from '../../../config/config.env';
import { CreateUserDto, CreateUserSchema } from '../types/user.dto';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserInfoRepository } from '../repositories/user-info.reposiory';
import { generateToken } from '../../../shared/utils/jwt-token';

@injectable()
export class UserRegisterHandler {
    constructor(
        @inject(TYPES.ConfigEnv) private configEnv: ConfigEnv,
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.UserInfoRepository) private userInfoRepository: UserInfoRepository,
    ) {}
    public async registerAsync(input: unknown): Promise<unknown> {
        let data: CreateUserDto;
        try {
            data = await CreateUserSchema.parseAsync(input);
        } catch (err) {
            if (err instanceof ZodError) {
                throw {
                    status: 400,
                    message: 'Validation failed',
                    issues: err.errors,
                };
            }
            throw err;
        }

        const existing = await this.userRepository.model.findOne({
            userName: data.userName,
        });
        if (existing) {
            throw { status: 400, message: 'Username already exists' };
        }
        const { saltRounds, passwordSecret, jwtSecret, jwtTokenExpire } =
            this.configEnv;
        const salt = await bcrypt.genSalt(saltRounds);
        data.password = await bcrypt.hash(data.password, salt);
        data.passwordSecret =
            passwordSecret + crypto.randomBytes(32).toString('hex');
        const created = await this.userRepository.create(data);
        const userSession = await this.userInfoRepository.createUserInfo(created.id);
        const payload = {
            userId: created._id,
            userName: created.userName,
            userSession
        };
        const accessToken = generateToken(
            jwtSecret,
            payload,
            jwtTokenExpire,
        );
        const resetToken = generateToken(
            jwtSecret,
            payload,
            jwtTokenExpire,
        );

        const user = this.userRepository.toSafeUser(created);
        return {
            user,
            accessToken,
            resetToken,
        };
    }
}
