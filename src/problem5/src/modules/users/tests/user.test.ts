import supertest from 'supertest';
import {
    SetupContinuousIntegrationTest,
    setupContinuousIntegrationTest,
} from '../../../shared/utils/setup-ci-integration';

describe('TicketController', () => {
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
        it('should return user info when request register user', async () => {
            const response = await supertest(appContext.app.getServer())
                .post('/users/register')
                .set('x-api-key', appContext.configEnv.xApiKey)
                .send({
                    fullName: 'User test',
                    userName: 'userTest',
                    password: 'SuperSecure123!',
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
    });
});
