import { redisClient } from '../init/redisConnect.js';
import { multiCast } from '../utils/response/createResponse.js';
import { getUsersInRoom } from '../session/room.session.js';
import { PACKET_TYPE } from '../constants/header.js';
import Redis from 'ioredis';

const redisSubscriber = new Redis({
  host: 'localhost', // Redis 서버 호스트
  port: 6379, // Redis 서버 포트
});

export const subscribeToPositionUpdate = () => {
  redisSubscriber.psubscribe('room:*:위치업데이트', (err, count) => {
    if (err) {
      console.error('Redis 패턴 구독 실패:', err);
    } else {
      console.log(`패턴 구독 성공: ${count}개의 채널`);
    }
  });

  // 'pmessage'로 패턴에 맞는 채널에서 수신
  redisSubscriber.on('pmessage', (pattern, channel, message) => {
    console.log(`수신된 채널: ${channel}`);
    const { roomId, characterPositions } = JSON.parse(message);
    console.log('수신된 메시지:', { roomId, characterPositions });

    const usersInRoom = getUsersInRoom(roomId);
    multiCast(usersInRoom, PACKET_TYPE.POSITION_UPDATE_NOTIFICATION, {
      positionUpdateNotification: { characterPositions },
    });
  });
};
