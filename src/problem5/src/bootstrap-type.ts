export const TYPES = {
    ConfigEnv: Symbol.for('ConfigEnv'),
    LoggerService: Symbol.for('LoggerService'),
    AnalysisService: Symbol.for('AnalysisService'),
    RedisService: Symbol.for('RedisService'),
    // Controllers
    AppController: Symbol.for('AppController'),
    UserController: Symbol.for('UserController'),

    MongooseProvider: Symbol.for('MongooseProvider'),
    Logger: Symbol.for('Logger'),
    LoggerMiddleware: Symbol.for('LoggerMiddleware'),
    UserRepository: Symbol.for('UserRepository'),
    UserInfoRepository: Symbol.for('UserInfoRepository'),
    // Interceptor
    ResponseInterceptor: Symbol.for('ResponseInterceptor'),
    AuthXApiKeyMiddleware: Symbol.for('AuthXApiKeyMiddleware'),
    ErrorHandlerMiddleware: Symbol.for('ErrorHandlerMiddleware'),

    // Handlers
    // |__Users
    UserRegisterHandler: Symbol.for('UserRegisterHandler'),
};
