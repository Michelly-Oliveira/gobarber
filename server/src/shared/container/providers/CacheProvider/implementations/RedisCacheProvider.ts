import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    // Return from JSON.parse a variable of the same type as defined when the function was called
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // Get all the keys that have the prefix:something_after
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    // Delete all keys at the same time
    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
