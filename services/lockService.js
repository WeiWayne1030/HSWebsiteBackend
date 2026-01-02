const { client } = require('./redisClient');

async function acquireLock(key, ttl = 10) {
    const result = await client.set(key, '1', { NX: true, EX: ttl });
    return result === 'OK';
}

async function releaseLock(key) {
    await client.del(key);
}

module.exports = { acquireLock, releaseLock };