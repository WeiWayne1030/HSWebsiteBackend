const { client } = require('./redisClient');
const BaseCacheService = require('./base/baseCacheService');

class StringCacheService extends BaseCacheService {

    async get(key) {
        await this.prepare();
        return await client.get(key);
    }

    async set(key, value, ttl) {
        await this.prepare();
        await client.set(key, value, { EX: this.getTTL(ttl) });
    }
}

module.exports = new StringCacheService();
