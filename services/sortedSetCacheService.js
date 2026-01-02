const { client } = require('./redisClient');
const BaseCacheService = require('./base/baseCacheService');

class SortedSetCacheService extends BaseCacheService {

    async add(key, member, score) {
        await this.prepare();
        await client.zAdd(key, { score, value: member });
    }

    async getTop(key, count = 10) {
        await this.prepare();
        return await client.zRevRangeWithScores(key, 0, count - 1);
    }

    async getRank(key, member) {
        await this.prepare();
        return await client.zRevRank(key, member);
    }
}

module.exports = new SortedSetCacheService();