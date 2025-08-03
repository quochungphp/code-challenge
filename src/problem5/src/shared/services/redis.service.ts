import Redis, { RedisOptions } from 'ioredis';
import { ConfigEnv } from '../../config/config.env';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../boostrap-type';

@injectable()
export class RedisService {
    private readonly redisMaster: Redis;
    private readonly redisReplica: Redis;

    constructor(
        @inject(TYPES.ConfigEnv) private configEnv: ConfigEnv,
    ){
        const {
            redisHost: host,
            redisPort: port,
            redisPassword: password,
            redisReplicaHost,
            isEnableRedisTLS
        } = configEnv;

        const option: RedisOptions = {
            host,
            port,
            password,
        };

        if (isEnableRedisTLS) {
            option.tls = {};
        }

        this.redisReplica = new Redis({
            ...option,
            host: redisReplicaHost,
            role: 'slave',
        });
        this.redisMaster = new Redis({ ...option, role: 'master' });
    }

    get writer(): Redis {
        return this.redisMaster;
    }

    get reader(): Redis {
        return this.redisReplica;
    }

    async setValue(key: string, value: unknown, expireTime?: number) {
        const serializedValue = JSON.stringify(value);
        if (expireTime) {
            await this.redisMaster.setex(key, expireTime, serializedValue);
        } else {
            await this.redisMaster.set(key, serializedValue);
        }
    }

    async getValue<T>(key: string): Promise<T | undefined> {
        const value = await this.redisReplica.get(key);
        return value ? JSON.parse(value) : undefined;
    }

    async deleteValue(key: string) {
        await this.redisMaster.del(key);
    }

    async deleteItemsByPrefixKey(
        itemPrefix = '',
    ): Promise<string[] | undefined> {
        const pattern = `${itemPrefix}*`;
        const keys = await this.redisMaster.keys(pattern);

        if (!keys || !keys.length) {
            return;
        }

        for (const key of keys) {
            await this.deleteValue(key);
        }

        return keys;
    }

    /**
     * Utility function to get item and also cache that item
     *
     * @param cacheKey
     * @param getItem
     * @returns
     */
    async getItemWithCache<T>(
        getCacheKey: () => string,
        getItem: () => Promise<T | undefined>,
    ): Promise<T | undefined> {
        const cacheKey = getCacheKey();
        const cachedItem = await this.getValue<T>(cacheKey);
        if (!cachedItem) {
            const item = await getItem();
            if (item) {
                this.setValue(cacheKey, item);
            }
            return item;
        }
        return cachedItem;
    }

    async flushAll() {
        return this.redisMaster.flushall();
    }
}
