import { config } from '../config/config.js';
import { loadProtos } from './loadProto.js';
import { redisClient } from './redisConnect.js';

const initServer = async () => {
  try {
    await loadProtos();
    await redisClient.rpush(
      'gameServers',
      `${config.server.host}:${config.server.port}`,
    ); // 열 수 있는 서버 추가.
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default initServer;
