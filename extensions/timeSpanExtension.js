const { ttlJitterSeconds } = require('../config/cacheOption');

function withJitter(ttl) {
    const jitter = Math.floor(Math.random() * ttlJitterSeconds);
    return ttl + jitter;
}

module.exports = { withJitter };