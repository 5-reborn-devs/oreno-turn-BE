import { redisManager } from '../../classes/managers/redis.manager.js';
import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

const PING_TIMEOUT = 10000; // 타임아웃 시간 10초 (10000ms)

export const heartBeatHandler = async (socket, payload) => {
  try {
    const { message, timestamp } = payload;
    const combinedTimestamp = timestamp.toNumber();
    const localTime = Date.now();
    const timeDifference = localTime - combinedTimestamp;

    console.log(`유저 ${user.id} - Ping 수신 시간: ${combinedTimestamp}`);
    console.log(`현재 시간: ${localTime}, 시간 차이: ${timeDifference}ms`);
    // 유저 정보 들고옴
    const user = await redisManager.users.get(socket.token);
    console.log('하트비트에서 유저', user);
    // 유저의 핑 시간 업데이트 및 타이머 리셋
    user.updatePingTime(socket);
    // Pong 응답 전송
    sendResponsePacket(socket, PACKET_TYPE.PONG_RESPONSE, {
      message: 'success',
      timestamp: localTime,
    });
  } catch (err) {
    console.error('하트비트 처리 중 에러:', err);
  }
};

// 유저 타임아웃 처리 콜백
export const handleTimeout = (socket) => {
  console.log(`유저 ${socket.id} - 타임아웃으로 연결 종료`);
  sendResponsePacket(socket, PACKET_TYPE.PONG_RESPONSE, { message: 'fail' });
  socket.disconnect();
};
