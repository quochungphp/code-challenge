export const TYPES = {
    ConfigEnv: Symbol.for('ConfigEnv'),
    LoggerService: Symbol.for('LoggerService'),
    AnalysisService: Symbol.for('AnalysisService'),
    RedisService: Symbol.for('RedisService'),
    AppController: Symbol.for('AppController'),
    MongooseProvider: Symbol.for('MongooseProvider'),
    Logger: Symbol.for('Logger'),
    LoggerMiddleware: Symbol.for('LoggerMiddleware'),
    UserRepository: Symbol.for('UserRepository'),
    // Interceptor
    ResponseInterceptor: Symbol.for('ResponseInterceptor'),
    AuthXApiKeyMiddleware: Symbol.for('AuthXApiKeyMiddleware'),
    ErrorHandlerMiddleware: Symbol.for('ErrorHandlerMiddleware'),

    // Handlers
    // Users
    UserConnectHandler: Symbol.for('UserConnectHandler'),
};
