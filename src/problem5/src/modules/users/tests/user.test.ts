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
    });
});
