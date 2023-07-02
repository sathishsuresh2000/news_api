const NodeCache = require( "node-cache" );
const cacheConfig = require("config").get("cache");

class CacheStore {

  constructor() {
    this.cache = new NodeCache(cacheConfig);
  }

  set(key, value) {
    return this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
  
  has(key) {
    return this.cache.has(key);
  }
}

module.exports = new CacheStore();