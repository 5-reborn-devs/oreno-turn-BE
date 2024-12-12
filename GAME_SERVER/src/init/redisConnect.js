import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// redis 초기화
export const redisClient = new Redis(
  `redis://${config.redis.host}:${config.redis.port}`,
);

// redis 연결 오류가 발생한 경우 서버를 종료함.
redisClient.on('error', (err) => {
  console.error('Redis 클라이언트 오류:', err.errno);
  switch (err.errno) {
    case -4078:
      console.error(
        'Redis DB와 연결할 수 없습니다. Redis 상태를 확인해주세요.',
      );
      break;
    default:
      console.error('알 수 없는 오류코드:', JSON.stringify(err));
  }
  console.log('서버를 종료합니다.');
  process.exit(1);
});

// redis를 연결
export const connectRedis = async () => {
  try {
    if (redisClient.status === 'ready') {
      console.log('Redis에 연결 준비 중.');
    }

    // 이미 연결되었거나 연결 중이라면 connect()를 호출하면 안돼
    if (!redisClient.status || redisClient.status === 'wait') {
      console.log('redisClient.status => ', redisClient.status);
      await redisClient.connect();
      console.log('Redis에 연결되었습니다.');
    } else {
      console.log('레디스 현재 상태 => ', redisClient.status);
    }
  } catch (error) {
    console.error('Redis에 연결할 수 없습니다:', error);
  }
};

await connectRedis();
