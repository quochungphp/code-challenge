export class UserDto {
    id!: string;
    fullName!: string;
    userName!: string;
    createdAt!: string;
    updatedAt!: string;
}
export class UserRegisterResponseDto {
    user!: UserDto;
    accessToken!: string;
    resetToken!: string;
}
