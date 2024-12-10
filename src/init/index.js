import { subscribeToPositionUpdate } from '../tests/positionUpdateWorker.js';
import { loadProtos } from './loadProto.js';
import { redisClient } from './redisConnect.js';

const initServer = async () => {
  try {
    await loadProtos();
    await redisClient.flushall(); // 레디스 초기화
    subscribeToPositionUpdate();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default initServer;
