const { connect } = require('../redisClient');
const { withJitter } = require('../../extensions/timeSpanExtension');
const { defaultTTLSeconds } = require('../../config/cacheOption');

class BaseCacheService {
    async prepare() {
        await connect();
    }

    getTTL(ttl) {
        return withJitter(ttl ?? defaultTTLSeconds);
    }
}

module.exports = BaseCacheService;