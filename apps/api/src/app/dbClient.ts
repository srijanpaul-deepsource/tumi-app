import { PrismaClient } from '@tumi/server-models';
import * as LRU from 'lru-cache';
import io = require('@pm2/io');

const currentQueries = io.counter({
  name: 'Realtime query count',
  id: 'app/realtime/queries',
});

const queryDuration = io.metric({
  name: 'Query Duration',
  id: 'app/realtime/queryDuration',
});

const queryCache = new LRU(100);

const loggingMiddleware = async (params, next) => {
  currentQueries.inc();
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  queryDuration.set(after - before);
  currentQueries.dec();
  if (process.env.DEV) {
    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );
  }
  return result;
};

const cachingMiddleware = async (params, next) => {
  let result;
  if (params.model === 'EventRegistration' && params.action === 'aggregate') {
    const args = JSON.stringify(params.args);
    const cacheKey = `${params.model}_${params.action}_${args}`;
    result = queryCache.get(cacheKey);

    if (result === undefined) {
      result = await next(params);
      queryCache.set(cacheKey, result, 5000);
    }
  } else {
    result = await next(params);
  }
  return result;
};

class DBClient {
  public prisma: PrismaClient;
  private static instance: DBClient;
  private constructor() {
    this.prisma = new PrismaClient();
    this.prisma.$use(loggingMiddleware);
    this.prisma.$use(cachingMiddleware);
  }

  public static getInstance = () => {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  };
}

export default DBClient;
