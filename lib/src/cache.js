"use strict";
var promisify = require("util").promisify;
var NodeCache = require("node-cache");
var cache = new NodeCache({ stdTTL: 120, checkPeriod: 600 });
cache.setAsync = promisify(cache.set).bind(cache);
cache.getAsync = promisify(cache.get).bind(cache);
cache.delAsync = promisify(cache.del).bind(cache);
cache.ttlAsync = promisify(cache.ttl).bind(cache);
cache.getTtlAsync = promisify(cache.getTtl).bind(cache);
cache.keysAsync = promisify(cache.keys).bind(cache);
module.exports = cache;
//# sourceMappingURL=cache.js.map