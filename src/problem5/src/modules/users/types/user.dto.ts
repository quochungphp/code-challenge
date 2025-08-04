import { z } from 'zod';

export const CreateUserSchema = z.object({
    fullName: z.string().min(3).max(100),
    userName: z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9]+$/, {
            message: 'userName must be alphanumeric',
        }),
    password: z.string().min(6).max(100),
    passwordSecret: z.string().min(6).optional(),
});

export const UpdateUserSchema = CreateUserSchema.omit({
    userName: true,
    passwordSecret: true,
}).partial(); // All remaining fields optional

export const GetUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    userName: z.string().optional(),
    fullName: z.string().email().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type GetUsersQueryDto = z.infer<typeof GetUsersQuerySchema>;
