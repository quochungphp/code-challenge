import supertest from 'supertest';
import {
    SetupContinuousIntegrationTest,
    setupContinuousIntegrationTest,
} from '../../../shared/utils/setup-ci-integration';
import { sessionIdCacheKey } from '../../../shared/utils/generate-key';

describe('UserController', () => {
    let appContext: SetupContinuousIntegrationTest;
    beforeAll(async () => {
        appContext = await setupContinuousIntegrationTest();
    });

    beforeEach(async () => {
        await appContext.truncateTables();
        jest.resetModules();
        jest.clearAllMocks();
    });
    afterEach(async () => {
        await appContext.truncateTables();
        jest.clearAllMocks();
    });
    afterAll(async () => {
        await appContext.disconnect();
    });
    describe('User Module', () => {
        beforeEach(async () => {
            await appContext.truncateTables();
            jest.resetModules();
            jest.clearAllMocks();
        });

        afterEach(async () => {
            await appContext.truncateTables();
        });

        it('should return user info when request register user', async () => {
            const response = await supertest(appContext.app.getServer())
                .post('/users')
                .set('x-api-key', appContext.configEnv.xApiKey)
                .send({
                    fullName: 'User test',
                    userName: 'userTest',
                    password: 'SuperSecure123!',
                });
            // Cached  user create / login as a first time login
            const id = response.body.data.user.id;
            const cached = await appContext.redisService.getValue(
                sessionIdCacheKey(id),
            );
            expect(JSON.parse(cached as string)).toMatchObject({
                userId: expect.any(String),
                userName: 'userTest',
                userSession: {
                    userId: expect.any(String),
                    sessionId: expect.any(String),
                    secretKey: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    __v: 0,
                },
            });
            expect(response.body).toMatchObject({
                success: true,
                data: {
                    user: {
                        id: expect.any(String),
                        fullName: 'User test',
                        userName: 'userTest',
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                    accessToken: expect.any(String),
                    resetToken: expect.any(String),
                },
            });
        });

        it('should get user info', async () => {
            // Register first
            const registerRes = await supertest(appContext.app.getServer())
                .post('/users')
                .set('x-api-key', appContext.configEnv.xApiKey)
                .send({
                    fullName: 'Info User',
                    userName: 'infouser',
                    password: 'StrongPassword123!',
                });

            const id = registerRes.body.data.user.id;

            const res = await supertest(appContext.app.getServer())
                .get(`/users/${id}`)
                .set('x-api-key', appContext.configEnv.xApiKey);

            expect(res.status).toBe(200);
            expect(res.body.data.userName).toBe('infouser');
        });

        it('should update user info', async () => {
            const registerRes = await supertest(appContext.app.getServer())
                .post('/users')
                .set('x-api-key', appContext.configEnv.xApiKey)
                .send({
                    fullName: 'Old Name',
                    userName: 'updateuser',
                    password: 'StrongPassword123!',
                });

            const id = registerRes.body.data.user.id;

            const res = await supertest(appContext.app.getServer())
                .put(`/users/${id}`)
                .set('x-api-key', appContext.configEnv.xApiKey)
                .send({
                    fullName: 'New Name',
                });
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                data: {
                    id: expect.any(String),
                    fullName: 'New Name',
                    userName: 'updateuser',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            });
        });

        it('should delete a user', async () => {
            const registerRes = await supertest(appContext.app.getServer())
                .post('/users')
                .set('x-api-key', appContext.configEnv.xApiKey)
                .send({
                    fullName: 'Delete User',
                    userName: 'deleteuser',
                    password: 'StrongPassword123!',
                });

            const id = registerRes.body.data.user.id;

            const res = await supertest(appContext.app.getServer())
                .delete(`/users/${id}`)
                .set('x-admin-api-key', appContext.configEnv.xAdminApiKey);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                data: { message: 'User deleted' },
            });
        });

        it('should return list of users with pagination and filter', async () => {
            const users = [
                { fullName: 'User One', userName: 'user1' },
                { fullName: 'User Two', userName: 'user2' },
                { fullName: 'User Three', userName: 'user3' },
                { fullName: 'User Four', userName: 'user4' },
                { fullName: 'User Five', userName: 'user5' },
            ];

            for (const user of users) {
                await supertest(appContext.app.getServer())
                    .post('/users')
                    .set('x-api-key', appContext.configEnv.xApiKey)
                    .send({
                        ...user,
                        password: 'Password123!',
                    });
            }

            const listRes = await supertest(appContext.app.getServer())
                .get(`/users?page=1&limit=3`)
                .set('x-admin-api-key', appContext.configEnv.xAdminApiKey);
            expect(listRes.status).toBe(200);
            expect(listRes.body.data.items.length).toBeLessThanOrEqual(3);
            expect(listRes.body.data.total).toBe(5);
            expect(listRes.body.success).toBe(true);

            const filterRes = await supertest(appContext.app.getServer())
                .get(`/users?userName=user3`)
                .set('x-admin-api-key', appContext.configEnv.xAdminApiKey);

            expect(filterRes.status).toBe(200);
            expect(filterRes.body.data.items.length).toBe(1);
            expect(filterRes.body.data.items[0].userName).toBe('user3');
        });
    });
});
