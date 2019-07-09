const { promisify } = require("util");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 120, checkPeriod: 600 });

cache.setAsync = promisify(cache.set).bind(cache);
cache.getAsync = promisify(cache.get).bind(cache);
cache.delAsync = promisify(cache.del).bind(cache);
cache.ttlAsync = promisify(cache.ttl).bind(cache);
cache.getTtlAsync = promisify(cache.getTtl).bind(cache);
cache.keysAsync = promisify(cache.keys).bind(cache);

module.exports = cache;
